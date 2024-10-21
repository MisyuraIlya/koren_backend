import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { Like, Repository,FindManyOptions } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailChatService } from 'src/mail-chat/mail-chat.service';
import { MailTypeEnum } from 'src/enums/mail.enum';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';

@Injectable()
export class MailService {

  constructor(
    @InjectRepository(Mail)
    private readonly mailRepository: Repository<Mail>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,

    private readonly MailChatService: MailChatService
){}

  async create(createMailDto: CreateMailDto, senderId: string) {
    const { sendTo, title, description } = createMailDto;
    sendTo.push(senderId)
    const sender = await this.authRepository.findOne({ where: { uuid: senderId } });
    if (!sender) {
      throw new Error('Sender not found');
    }

    const recipients = await this.authRepository.find({
      where: sendTo.map(id => ({ uuid:id })),
    });
    if (recipients.length === 0) {
      throw new Error('No valid recipients found');
    }
    
    let uuid = uuidv4();
    const mails = await Promise.all(recipients.map(async recipient => {
      const mail = new Mail();
      mail.title = title;
      mail.uuid = uuid;
      mail.type = createMailDto?.type ? createMailDto.type : MailTypeEnum.Original;
      if (createMailDto?.exerciseId) {
        const find = await this.exerciseRepository.findOne({
          where: { id: createMailDto.exerciseId }
        });
        mail.exercise = find;
      }
      mail.description = description;
      mail.userRecive = recipient;
      mail.userSend = sender;
      return mail;
    }));

    const res = await this.mailRepository.save(mails);

    this.MailChatService.create({ description: createMailDto.description }, senderId, uuid);

    return {status:"success"};
  }

  async getUnreaded(userId: number){
    const findUser = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    return this.mailRepository.find({
      where:{userRecive: findUser, isRead: false},
      relations:['userSend']
    })

  }

  findAll() {
    return `This action returns all mail`;
  }

  async findOne(id: number, page = 1, search = '',type) {
    const findUser = await this.authRepository.findOne({
      where: { id: id },
    });

    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const take = 10;
    const skip = (page - 1) * take; 
    let options: FindManyOptions<Mail> = {
      where: { userRecive: findUser },
      relations: ['userSend'],
      take: take,
      skip: skip,
      order: { createdAt: 'DESC' }, 
    };

    if (search) {
      options.where = {
        ...options.where,
        description: Like(`%${search}%`), 
      };
    }

    if(type){
      options.where = {
        ...options.where,
        type: type
      }
    }

    const [mails, total] = await this.mailRepository.findAndCount(options);

    const totalMessages = await this.mailRepository.count({
      where: {
        userRecive: findUser,
      },
    });

    const totalFeedBacks = await this.mailRepository.count({
      where: {
        userRecive: findUser,
        type: MailTypeEnum.FeedBack,
      },
    });

    const totalSystem = await this.mailRepository.count({
      where: {
        userRecive: findUser,
        type: MailTypeEnum.System, 
      },
    });

    const totalRegular = await this.mailRepository.count({
      where: {
        userRecive: findUser,
        type: MailTypeEnum.Original, 
      },
    });

    const totalPages = Math.ceil(total / take);

  return { mails, total, totalMessages, totalPages, totalFeedBacks, totalSystem, totalRegular };
  }

  async update(uuid: string, userId: number) {
    const findUser = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const findMail = await this.mailRepository.findOne({
      where: {uuid: uuid, userRecive: findUser}
    })

    if (!findMail) {
      throw new BadRequestException('mail not found');
    }

    findMail.isRead = true
    await this.mailRepository.save(findMail)

    return findMail;
  }

  async getFeedBack(userId:number, exerciseId: number){
    const findUser = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    const find = await this.exerciseRepository.findOne({
      where: { id: exerciseId }
    });

    if (!find) {
      throw new BadRequestException('exercise not found');
    }

    return this.mailRepository.findOne({
      where:{userRecive:findUser, exercise: find}
    })

  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}

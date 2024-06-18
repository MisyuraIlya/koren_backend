import { Injectable } from '@nestjs/common';
import { CreateMailChatDto } from './dto/create-mail-chat.dto';
import { UpdateMailChatDto } from './dto/update-mail-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mail } from 'src/mail/entities/mail.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { MailChat } from './entities/mail-chat.entity';

@Injectable()
export class MailChatService {

  constructor(
    @InjectRepository(MailChat)
    private readonly mailChatRepository: Repository<MailChat>,
    @InjectRepository(Mail)
    private readonly mailRepository: Repository<Mail>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,

  
){}

  async create(dto: CreateMailChatDto, senderId: number,uuid:string) {
      const sender = await this.authRepository.findOne({ where: { id: senderId } });
      if (!sender) {
        throw new Error('Sender not found');
      }
      const newMessage = new MailChat();
      newMessage.user = sender
      newMessage.uuid = uuid
      newMessage.description = dto.description
      return this.mailChatRepository.save(newMessage);
  }

  findAll() {
    return `This action returns all mailChat`;
  }

  async findOne(id: string) {
    const chats = await this.mailChatRepository.find({
      where: { uuid: id },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
    console.log('chats',chats)
    return chats;
  }

  update(id: number, updateMailChatDto: UpdateMailChatDto) {
    return `This action updates a #${id} mailChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} mailChat`;
  }
}

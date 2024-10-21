import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConfirmationDto } from './dto/create-confirmation.dto';
import { UpdateConfirmationDto } from './dto/update-confirmation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Confirmation } from './entities/confirmation.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { CourseEntity } from 'src/course/entities/course.entity';

@Injectable()
export class ConfirmationService {
  constructor(
    @InjectRepository(Confirmation)
    private readonly confirmationRepository: Repository<Confirmation>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
) {}

  async create(createConfirmationDto: CreateConfirmationDto) {
    const findUser = await this.authRepository.findOne({
      where:{id: createConfirmationDto.userId}
    })

    if(!findUser) throw new BadRequestException('user not found');

    const findCourse = await this.courseRepository.findOne({
      where:{id:createConfirmationDto.courseId}
    })

    if(!findCourse) throw new BadRequestException('user not found');

    const confirm = await this.confirmationRepository.findOne({
      where:{course: findCourse, user: findUser}
    })

    if(!confirm){
      const newConfirm = new Confirmation()
      newConfirm.isRead = true
      newConfirm.course = findCourse
      newConfirm.user = findUser
      return await this.confirmationRepository.save(newConfirm)
    } else {
      return confirm
    }
  }

  findAll() {
    return `This action returns all confirmation`;
  }

  async findOne(userId) {
    const findUser = await this.authRepository.findOne({
      where:{id: userId}
    })

    if(!findUser) throw new BadRequestException('user not found');

    return await this.confirmationRepository.find({
      where:{user: findUser}
    })
  }

  update(id: number, updateConfirmationDto: UpdateConfirmationDto) {
    return `This action updates a #${id} confirmation`;
  }

  remove(id: number) {
    return `This action removes a #${id} confirmation`;
  }
}

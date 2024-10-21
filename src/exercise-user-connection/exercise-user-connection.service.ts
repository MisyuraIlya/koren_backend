import { Injectable } from '@nestjs/common';
import { CreateExerciseUserConnectionDto } from './dto/create-exercise-user-connection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseUserConnection } from './entities/exercise-user-connection.entity';
import { MailService } from 'src/mail/mail.service';
import { CreateMailDto } from 'src/mail/dto/create-mail.dto';
import { MailTypeEnum } from 'src/enums/mail.enum';

@Injectable()
export class ExerciseUserConnectionService {

  constructor(
    @InjectRepository(ExerciseUserConnection)
    private readonly exerciseUserConnectionRepository: Repository<ExerciseUserConnection>,

    private readonly MailService: MailService
  ){}

  create(createExerciseUserConnectionDto: CreateExerciseUserConnectionDto) {
    return 'This action adds a new exerciseUserConnection';
  }

  findAll() {
    return `This action returns all exerciseUserConnection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseUserConnection`;
  }

  async resendExercise(id: number) {
    const find = await this.exerciseUserConnectionRepository.findOne({
      where:{id:id},
      relations:['connection','connection.exercise','connection.teacher','student']
    })
    
    find.isDone = false
    find.isResend = true
    this.exerciseUserConnectionRepository.save(find)

    const obj = {
      sendTo:[find.student.uuid],
      title: `הוחזר לתיקון ${find.connection.exercise.title}`,
      description:`הוחזר לתיקון ${find.connection.exercise.title}`,
      type: MailTypeEnum.Original
    } as CreateMailDto
    this.MailService.create(obj,find.connection.teacher.uuid)



    return find;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseUserConnection`;
  }
}

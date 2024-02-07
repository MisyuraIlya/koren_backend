import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { UpdateStudentAnswerDto } from './dto/update-student-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/student-answer.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';

@Injectable()
export class StudentAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly studentAnswerRepository: Repository<StudentAnswer>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(StudentHistory)
    private readonly studentHistoryRepository: Repository<StudentHistory>,
  ){}

  async handleAnswer(id:number, studentId: number, historyId: number, createStudentAnswerDto: CreateStudentAnswerDto) {
    const user = await this.authRepository.findOne({
      where: {id: studentId}
    })

    if (!user) throw new BadRequestException('user not found');
    
    const answerExercise = await this.answerRepository.findOne({
      where:{id:id}
    })

    if (!answerExercise) throw new BadRequestException('answerExercise not found');

    const history = await this.studentHistoryRepository.findOne({
      where: {id: historyId}
    })

    if (!history) throw new BadRequestException('history not found');

    let answer = await this.studentAnswerRepository.findOne({
      where:{student: user, answer: answerExercise}
    })

    if(!answer){
      answer = new StudentAnswer();
      answer.createdAt = new Date();
      answer.student = user,
      answer.answer = answerExercise
      answer.history = history
    }
    answer.value = createStudentAnswerDto.value
    answer.updatedAt = new Date();
    answer.isCorrect = answerExercise.value === createStudentAnswerDto.value
    return this.studentAnswerRepository.save(answer);

  }

  findAll() {
    return `This action returns all studentAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentAnswer`;
  }

  update(id: number, updateStudentAnswerDto: UpdateStudentAnswerDto) {
    return `This action updates a #${id} studentAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentAnswer`;
  }
}

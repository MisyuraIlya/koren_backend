import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentHistoryDto } from './dto/create-student-history.dto';
import { UpdateStudentHistoryDto } from './dto/update-student-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentHistory } from './entities/student-history.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';

@Injectable()
export class StudentHistoryService {
  constructor(
    @InjectRepository(StudentHistory)
    private readonly studentHistoryRepository: Repository<StudentHistory>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
    @InjectRepository(ExerciseGroupConnection)
    private readonly exerciseGroupConnectionRepository: Repository<ExerciseGroupConnection>,
    @InjectRepository(ExerciseUserConnection)
    private readonly exerciseUserConnectionRepository: Repository<ExerciseUserConnection>,
    
  ){}

  async create(createStudentHistoryDto: CreateStudentHistoryDto) {
    const student = await this.authRepository.findOne({
      where:{id: +createStudentHistoryDto.studentId}
    })

    if(!student) throw new BadRequestException('not found student')

    const exercise = await this.exerciseRepository.findOne({
      where:{id: +createStudentHistoryDto.exerciseId},
      relations:['course']
    })

    if(!exercise) throw new BadRequestException('not found exercise')

    const checkIsThereHistory = await this.studentHistoryRepository.findOne({
      where:{student:student, exercise:exercise}
    })

    if(!checkIsThereHistory){
      const history = new StudentHistory()
      history.grade = 0
      history.student = student
      history.course = exercise.course;
      history.exercise = exercise
      history.isDone = false;
      history.createdAt = new Date()
      history.updatedAt = new Date()
      history.totalQuestions = 0
      history.totalCorrect = 0
      history.totalUncorrect = 0
      const res = await this.studentHistoryRepository.save(history)
      return {isNew: true, data:res }
    }
    return {isNew: false, data:checkIsThereHistory }
  }

  findAll() {
    return `This action returns all studentHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentHistory`;
  }

  async update(id: number, dto: UpdateStudentHistoryDto) {
    console.log('id',id)
    const find = await this.studentHistoryRepository.findOne({
      where:{id:id},
      relations:['student']
    })

    if(find) {
      const exerciseId = dto.exerciseId
      const student = find.student.id
      
      const connection = await this.exerciseGroupConnectionRepository
      .createQueryBuilder("egc")
      .innerJoin("egc.students", "euc")
      .where("egc.exercise.id = :exerciseId", { exerciseId })
      .andWhere("euc.student.id = :studentId", { studentId: student }) // Provide value for studentId
      .getOne();

      if(connection){
        const findUserGroup = await this.exerciseUserConnectionRepository.findOne({
          where:{connection:connection, student:find.student}
        })
        findUserGroup.isDone = true
        findUserGroup.isResend = false
        this.exerciseUserConnectionRepository.save(findUserGroup)
      }
      
      find.isDone = dto.isDone 
      return this.studentHistoryRepository.save(find)
      
    }

  }

  remove(id: number) {
    return `This action removes a #${id} studentHistory`;
  }
}

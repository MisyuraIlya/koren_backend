import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentHistoryDto } from './dto/create-student-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentHistory } from './entities/student-history.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';
import EngineTypes from 'src/engine/enums';
import { UpdateManualGradeDto } from './dto/update-manual-grade';
import { UpdateStudentHistoryDto } from './dto/update-manual-grade.dto';
import { StudentAnswer } from 'src/student-answer/entities/student-answer.entity';

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
    @InjectRepository(StudentAnswer)
    private readonly studentAnswerRepository: Repository<StudentAnswer>,
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
    const find = await this.studentHistoryRepository.findOne({
      where:{id:id},
      relations:[
        'answers',
        'answers.answer',
        'answers.answer.objective',
        'student',
        'exercise',
        'exercise.tabs',
        'exercise.tabs.tasks',
        'exercise.tabs.tasks.rows',
        'exercise.tabs.tasks.rows.objectives'
      ]
    })

    if(find) {
      const exerciseId = dto.exerciseId
      const student = find.student.id
      find.grade = await this.handleGrade(find)
      
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

  private async handleGrade(history: StudentHistory){

      const specialTypes = [
        EngineTypes.INPUT,
        EngineTypes.INPUT_CENTERED,
        EngineTypes.SELECT_BOX,
        EngineTypes.ROOT_INPUT,
        EngineTypes.MIX_DRAG,
        EngineTypes.CHECK_BOX,
        EngineTypes.TYPED_WORD    
      ]
      let countExercises = 0
      let numberCorrects = 0
      let openQuestion = 0 

      const errorIds:string[] = []
      const openQuestionIds:string[] = []
      history.exercise?.tabs?.map((item) => {
        item.tasks?.map((item2) => {
          item2?.rows?.map((item3) => {
            item3?.objectives?.map((item4) => {
              if(specialTypes.includes(item4.moduleType as EngineTypes)){
                console.log(item4.moduleType)
                countExercises++
              }
              if(item4.moduleType == EngineTypes.OPEN_QUESTION || item4.moduleType == EngineTypes.OPEN_QUESTION_HAMAROT){
                openQuestion++
                openQuestionIds.push(`${item4.id}`)
              }
            })
          })
        })
      })
      history.answers?.map((item) => {
        if(item.isCorrect){
          numberCorrects++
        }
      })
      const exerciseByOne = 100 / ( countExercises + openQuestion)
      let totalForOpenQuestion = 0

      history.answers?.map((item) => {
        errorIds.push(`${item.answer.objective.id}`)
        totalForOpenQuestion += item.grade
      })
      const gradeTotal = exerciseByOne * numberCorrects + totalForOpenQuestion
      history.totalCorrect = numberCorrects;
      history.totalUncorrect = countExercises - numberCorrects;
      history.totalQuestions = countExercises;
      history.openQuestions = openQuestion;
      history.errorIds = errorIds
      history.openQuestionIds = openQuestionIds
      return gradeTotal
  }

  async updateManualGrade(historyId: number, dto: UpdateManualGradeDto) {
    const find = await this.studentHistoryRepository.findOne({
      where:{id:historyId},
      relations:[
        'answers',
        'answers.answer',
        'answers.answer.objective',
        'student',
        'exercise',
        'exercise.tabs',
        'exercise.tabs.tasks',
        'exercise.tabs.tasks.rows',
        'exercise.tabs.tasks.rows.objectives'
      ]
    })
    if(find) {
      const specialTypes = [
        EngineTypes.INPUT,
        EngineTypes.INPUT_CENTERED,
        EngineTypes.SELECT_BOX,
        EngineTypes.ROOT_INPUT,
        EngineTypes.MIX_DRAG,
        EngineTypes.CHECK_BOX,
        EngineTypes.TYPED_WORD,
        EngineTypes.OPEN_QUESTION,
        EngineTypes.OPEN_QUESTION_HAMAROT
      ]
      let countExercises = 0
      let openQuestion = 0 
      find.exercise?.tabs?.map((item) => {
        item.tasks?.map((item2) => {
          item2?.rows?.map((item3) => {
            item3?.objectives?.map((item4) => {
              if(specialTypes.includes(item4.moduleType as EngineTypes)){
                countExercises++
              }
              if(item4.moduleType == EngineTypes.OPEN_QUESTION || item4.moduleType == EngineTypes.OPEN_QUESTION_HAMAROT){
                openQuestion++
              }
            })
          })
        })
      })

      let openQuestionGradeForOne = 100 / countExercises
      const result = (dto.grade / 100) * openQuestionGradeForOne;

      const findStudentAnswer = await this.studentAnswerRepository.findOne({
        where:{id:dto.studentAnswerId}
      })
      console.log('result',result)
      findStudentAnswer.gradeToShow = dto.grade
      findStudentAnswer.grade = result
      await this.studentAnswerRepository.save(findStudentAnswer)
      
      const updatedHistory = await this.studentHistoryRepository.findOne({
        where:{id:historyId},
        relations:[
          'answers',
          'answers.answer',
          'answers.answer.objective',
          'student',
          'exercise',
          'exercise.tabs',
          'exercise.tabs.tasks',
          'exercise.tabs.tasks.rows',
          'exercise.tabs.tasks.rows.objectives'
        ]
      })
      const newGrade = await this.handleGrade(updatedHistory)
      find.grade = newGrade
      return this.studentHistoryRepository.save(find)
      
    }
  }

}

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
import { UpdateTeacherGrade } from './dto/update-teacher-grade.dto';
import { CourseEntity } from 'src/course/entities/course.entity';
import { Shield } from 'src/shield/entities/shield.entity';
import { ShieldEnum } from 'src/enums/shield.enum';
import { MailService } from 'src/mail/mail.service';
import { CreateMailDto } from 'src/mail/dto/create-mail.dto';
import { MailTypeEnum } from 'src/enums/mail.enum';

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
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(Shield)
    private readonly shieldRepository: Repository<Shield>,

    private readonly MailService: MailService
    
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
        'exercise.tabs.tasks.rows.objectives',
        'exercise.tabs.tasks.rows.objectives.answers'
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
          where:{connection:connection, student:find.student},
          relations:['student','connection','connection.exerciseType','connection.teacher','connection.exercise']
        })
        findUserGroup.isDone = true
        findUserGroup.isResend = false
        this.exerciseUserConnectionRepository.save(findUserGroup)

        const obj = {
          sendTo:[findUserGroup.connection.teacher.uuid],
          title: `תלמיד סיים ${findUserGroup.connection.exerciseType.title} ${findUserGroup.connection.exercise.title}`,
          description:`תלמיד סיים ${findUserGroup.connection.exerciseType.title} ${findUserGroup.connection.exercise.title}`,
          type: MailTypeEnum.Original
        } as CreateMailDto
        this.MailService.create(obj,findUserGroup.student.uuid)
      }
      
      find.isDone = dto.isDone 



      return this.studentHistoryRepository.save(find)
      
      
    }

  }

  remove(id: number) {
    return this.studentHistoryRepository.delete(id)
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
                countExercises++
              }
              if(item4.moduleType == EngineTypes.OPEN_QUESTION || item4.moduleType == EngineTypes.OPEN_QUESTION_HAMAROT){
                openQuestion++
                openQuestionIds.push(`${item4.id}`)
              }
              if(item4.moduleType == EngineTypes.INPUT_CENTERED || item4?.moduleType == EngineTypes.INPUT){
                if(item4.answers?.[0]?.value === 'E'){
                  numberCorrects++
                }
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
        if(!item.isCorrect){
          errorIds.push(`${item.answer.objective.id}`)
        }
        totalForOpenQuestion += item.grade
      })
      console.log('errorIds',errorIds)
      const gradeTotal = exerciseByOne * numberCorrects + totalForOpenQuestion
      history.totalCorrect = numberCorrects;
      history.totalUncorrect = countExercises - numberCorrects;
      history.totalQuestions = countExercises;
      history.openQuestions = openQuestion;
      history.errorIds = errorIds
      history.openQuestionIds = openQuestionIds
      return parseFloat(gradeTotal.toFixed(2))
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

  async teacherGradeUpdate(historyId: number, dto: UpdateTeacherGrade) {
    const find = await this.studentHistoryRepository.findOne({
      where:{id:historyId}
    })

    if(!find) throw new BadRequestException('not found history')

    find.teacherGrade = parseFloat(dto.teacherGrade.toFixed(2))
    if(dto?.isFinalGrade){
      find.isFinalGrade = dto?.isFinalGrade
    }
    return this.studentHistoryRepository.save(find)
  }

  async getStatistic(
    uuid: string,
    lvl1: number,
    lvl2: number,
    lvl3: number,
    lvl4: number,
  ){
    const courseLvl1 = await this.courseRepository.findOne({
      where:{id:lvl1}
    })
    const group = await this.exerciseGroupConnectionRepository.findOne({
      where:{group: uuid},
      relations:['students','students.student']
    })
  
    const result = {
      column:['שם התלמיד','ממוצע של הקורס'],
      rows: []
    };

    await this.handleCourse(lvl2,result)
    await this.handleCourse(lvl3,result)
    await this.handleCourse(lvl4,result)
    await this.handleExerciseColumn(lvl4,result)
    const countLvl1 = await this.getExerciseCountAndIdsByCourseId(lvl1);
    const countLvl2 = await this.getExerciseCountAndIdsByCourseId(lvl2);
    const countLvl3 = await this.getExerciseCountAndIdsByCourseId(lvl3);
    const countLvl4 = await this.getExerciseCountAndIdsByCourseId(lvl4);
    
    if(group){
      await Promise.all(group.students.map(async (item) => {
        let averageLvl1 = 0;
        let averageLvl2 = 0;
        let averageLvl3 = 0;
        let averageLvl4 = 0;
  
        if(lvl1){
          const exercises = await this.getStudentCompletedExercisesByCourse(item.student, countLvl1.exerciseIds);
          averageLvl1 = await this.calculateGrade(countLvl1, exercises);
        }
  
        if(lvl2){
          const exercises = await this.getStudentCompletedExercisesByCourse(item.student, countLvl2.exerciseIds);
          averageLvl2 = await this.calculateGrade(countLvl2, exercises);
        }
  
        if(lvl3){
          const exercises = await this.getStudentCompletedExercisesByCourse(item.student, countLvl3.exerciseIds);
          averageLvl3 = await this.calculateGrade(countLvl3, exercises);
        }
  
        if(lvl4){
          const exercises = await this.getStudentCompletedExercisesByCourse(item.student, countLvl4.exerciseIds);
          averageLvl4 = await this.calculateGrade(countLvl4, exercises);
        }
  
        let data = []
        
        data.push({value:`${item?.student?.firstName} ${item?.student?.lastName}`,grade:0,teacherGrade:0,link:'', isExercise: false})
  
        if (lvl1) {
          data.push({ value:averageLvl1, grade:0,teacherGrade:0,link:'', isExercise: false})
        }
        if (lvl2) {
          data.push({ value:averageLvl2, grade:0,teacherGrade:0,link:'', isExercise: false});
        }
        if (lvl3) {
          data.push({ value:averageLvl3, grade:0,teacherGrade:0,link:'', isExercise: false}); 
        }
        if (lvl4) {
          data.push({ value:averageLvl4, grade:0,teacherGrade:0,link:'', isExercise: false}); 
        }
        
        const arrExercises = await this.handleExercisesRow(item,lvl4)
        data.push(...arrExercises)
        let resObj = {
          result: data,
          user: item.student,
          courseId: lvl1,
          gradeShield: await this.shieldRepository.findOne({where:{user:item.student,type:ShieldEnum.ShieldGrade,course:courseLvl1}}),
          gradeSubmit: await this.shieldRepository.findOne({where:{user:item.student,type:ShieldEnum.SubmitGrade,course:courseLvl1}})
        }
        result.rows.push(resObj);
      }));
    }
    
    return result;
  }

  async getStatisticByStudent(
    studentId: string,
    lvl1: number,
    lvl2: number,
    lvl3: number,
    lvl4: number,
  ){
    const courseLvl1 = await this.courseRepository.findOne({
      where:{id:lvl1}
    })

    const user = await this.authRepository.findOne({
      where:{id:+studentId}
    })

    const result = {
      column:['שם התלמיד','ממוצע של הקורס'],
      rows: []
    };

    await this.handleCourse(lvl2,result)
    await this.handleCourse(lvl3,result)
    await this.handleCourse(lvl4,result)
    await this.handleExerciseColumn(lvl4,result)
    const countLvl1 = await this.getExerciseCountAndIdsByCourseId(lvl1);
    const countLvl2 = await this.getExerciseCountAndIdsByCourseId(lvl2);
    const countLvl3 = await this.getExerciseCountAndIdsByCourseId(lvl3);
    const countLvl4 = await this.getExerciseCountAndIdsByCourseId(lvl4);

    if(user){
      // await Promise.all(group.students.map(async (item) => {
        let averageLvl1 = 0;
        let averageLvl2 = 0;
        let averageLvl3 = 0;
        let averageLvl4 = 0;
  
        if(lvl1){
          const exercises = await this.getStudentCompletedExercisesByCourse(user, countLvl1.exerciseIds);
          averageLvl1 = await this.calculateGrade(countLvl1, exercises);
        }
  
        if(lvl2){
          const exercises = await this.getStudentCompletedExercisesByCourse(user, countLvl2.exerciseIds);
          averageLvl2 = await this.calculateGrade(countLvl2, exercises);
        }
  
        if(lvl3){
          const exercises = await this.getStudentCompletedExercisesByCourse(user, countLvl3.exerciseIds);
          averageLvl3 = await this.calculateGrade(countLvl3, exercises);
        }
  
        if(lvl4){
          const exercises = await this.getStudentCompletedExercisesByCourse(user, countLvl4.exerciseIds);
          averageLvl4 = await this.calculateGrade(countLvl4, exercises);
        }
  
        let data = []
        
        data.push({value:`${user?.firstName} ${user?.lastName}`,grade:0,teacherGrade:0,link:'', isExercise: false})
  
        if (lvl1) {
          data.push({ value:averageLvl1, grade:0,teacherGrade:0,link:'', isExercise: false})
        }
        if (lvl2) {
          data.push({ value:averageLvl2, grade:0,teacherGrade:0,link:'', isExercise: false});
        }
        if (lvl3) {
          data.push({ value:averageLvl3, grade:0,teacherGrade:0,link:'', isExercise: false}); 
        }
        if (lvl4) {
          data.push({ value:averageLvl4, grade:0,teacherGrade:0,link:'', isExercise: false}); 
        }
        const connection = await this.exerciseUserConnectionRepository.findOne({
          where:{student: user}
        })
        const arrExercises = await this.handleExercisesRow(connection,lvl4)
        console.log('arrExercises',arrExercises)
        data.push(...arrExercises)
        let resObj = {
          result: data,
          user: user,
          courseId: lvl1,
          gradeShield: await this.shieldRepository.findOne({where:{user:user,type:ShieldEnum.ShieldGrade,course:courseLvl1}}),
          gradeSubmit: await this.shieldRepository.findOne({where:{user:user,type:ShieldEnum.SubmitGrade,course:courseLvl1}})
        }
        result.rows.push(resObj);
      // }));
    }
    
    return result;
    
  }
  
  private async handleCourse(id,result){
    const response = await this.courseRepository.findOne({
      where:{id:id}
    })

    if(response){
      result.column.push(response?.name)
    }
  }
  
  private async handleExerciseColumn(courseLvl4Id,result)
  {
    const response = await this.courseRepository.findOne({
      where:{id:courseLvl4Id},
      relations:['children','children.exercises'],
      order: {
        children: {
          orden: 'ASC'
        }
      }
    })
    if(response){
      response?.children?.map((item) => {
        item?.exercises?.map((item2) => {
          result.column.push(item2?.title)
        })
      })
    }
  }

  private async getExercisesData(course: CourseEntity, exerciseIds: number[]): Promise<number> {
    let count = 0;
    if (course.level === 5) {
      const exercises = await this.exerciseRepository.find({
        where: { course },
      });
      count += exercises.length;
      exerciseIds.push(...exercises.map(exercise => exercise.id));
    }

    if (course.children && course.children.length > 0) {
      for (const child of course.children) {
        count += await this.getExercisesData(child, exerciseIds);
      }
    }

    return count;
  }

  async getExerciseCountAndIdsByCourseId(courseId: number): Promise<{ count: number, exerciseIds: number[] }> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: [
        'children',
        'children.children',
        'children.children.children',
        'children.children.children.children',
        'children.children.children.children.children',
      ],
    });

    if (!course) {
      return {count:0,exerciseIds:[]}
    }


    
    const exerciseIds: number[] = [];
    const count = await this.getExercisesData(course, exerciseIds);

    return { count, exerciseIds };
  }

  private async getStudentCompletedExercisesByCourse(user: AuthEntity, exerciseIds: number[]){
    const result =  await this.studentHistoryRepository.createQueryBuilder('student_history')
    .where('student_history.studentId = :studentId', { studentId: user.id })
    .andWhere('student_history.exerciseId IN (:...exerciseIds)', { exerciseIds })
    .getMany();
   
    const result2 = result?.map((item) => { return {exerciseId: item.id, teacherGrade: item.teacherGrade, grade: item.grade}})
    return result2
  }

  private async calculateGrade(count,exercises):Promise<number>{
    const totalExercisesCompleted = exercises.length;
    const totalPossibleExercises = count.count;
    let totalGradesEarned = 0;
    for (const exercise of exercises) {
        totalGradesEarned += exercise.grade || 0; 
    }
    let averageGrade = 0;
    if (totalExercisesCompleted > 0) {
        averageGrade = totalGradesEarned / totalPossibleExercises;
    }
    return parseFloat(averageGrade.toFixed(2))
  }

  private async handleExercisesRow(exer: ExerciseUserConnection, lvl4: number) {
    const response = await this.courseRepository.findOne({
      where: { id: lvl4 },
      relations: ['children', 'children.exercises']
    });
  
    const result = [];
  
    if (response) {
      for (const item of response.children) {
        for (const item2 of item.exercises) {
          const findHistory = await this.studentHistoryRepository.findOne({
            where: { exercise: item2, student: exer.student }
          });
  
          if (findHistory) {
            result.push({ value:findHistory.teacherGrade ? findHistory.teacherGrade : findHistory.grade, grade: findHistory.grade, teacherGrade: findHistory.teacherGrade, link: await this.findFullPathExercise(item2.id), isExercise: true});
          } else {
            result.push({ value:0, grade: 0, teacherGrade: 0, link:'', isExercise: true });
          }
        }
      }
    }
    return result
  }

  private async findFullPathExercise(exerciseId: number) {
    const exercise = await this.exerciseRepository
    .createQueryBuilder('exercise')
    .leftJoinAndSelect('exercise.course', 'course')
    .leftJoinAndSelect('course.parent', 'parent')
    .leftJoinAndSelect('parent.parent', 'grandparent')
    .leftJoinAndSelect('grandparent.parent', 'gradgrandparent')
    .leftJoinAndSelect('gradgrandparent.parent', 'grandgradgrandparent')
    .where('exercise.id = :exerciseId', { exerciseId })  // Adjusted to use native parameter
    .getOne();
    return `/teacher/exercise/${exercise?.course?.parent?.parent?.parent?.parent?.id}/${exercise?.course?.parent?.parent?.parent?.id}/${exercise?.course?.parent?.parent?.id}/${exercise?.course?.parent?.id}/${exercise?.course?.id}`
    
  }
}

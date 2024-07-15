import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExerciseGroupConnectionDto } from './dto/create-exercise-group-connection.dto';
import { UpdateExerciseGroupConnectionDto } from './dto/update-exercise-group-connection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseGroupConnection } from './entities/exercise-group-connection.entity';
import { Repository } from 'typeorm';
import { empty, find } from 'rxjs';
import { Group } from 'src/group/entities/group.entity';
import { ExerciseType } from 'src/exercise-type/entities/exercise-type.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';
import { CreateExerciseGroupAnswerDto } from './dto/create-exercise-group-answer.dto';
import { ExerciseService } from 'src/exercise/exercise.service';
import { MailService } from 'src/mail/mail.service';
import { CreateMailDto } from 'src/mail/dto/create-mail.dto';
import { MailTypeEnum } from 'src/enums/mail.enum';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';

@Injectable()
export class ExerciseGroupConnectionService {
  constructor(
    @InjectRepository(ExerciseGroupConnection)
    private readonly exerciseGroupConnectionRepository: Repository<ExerciseGroupConnection>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(ExerciseType)
    private readonly exerciseTypeRepository: Repository<ExerciseType>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
    @InjectRepository(ExerciseUserConnection)
    private readonly exerciseUserConnectionRepository: Repository<ExerciseUserConnection>,
    @InjectRepository(StudentHistory)
    private readonly StudentHistoryRepository: Repository<StudentHistory>,

    private readonly MailService: MailService
  ){}

  async create(dto: CreateExerciseGroupConnectionDto) {
    const teacher = await this.authRepository.findOne({
        where: { id: +dto.teacherId }
    });
    if (!teacher) throw new BadRequestException('Teacher not found');

    const exercise = await this.exerciseRepository.findOne({
        where: { id: +dto.exerciseId }
    });
    if (!exercise) throw new BadRequestException('Exercise not found');

    const exerciseType = await this.exerciseTypeRepository.findOne({
        where: { title: dto.exerciseTypeId }
    });
    if (!exerciseType) throw new BadRequestException('ExerciseType not found');

    const semester = await this.semesterRepository.findOne({
        where: { active: true }
    });
    if (!semester) throw new BadRequestException('Active semester not found');

    let exerciseGroupConnection = await this.exerciseGroupConnectionRepository.findOne({
        where: { group: dto.groupUuid, teacher: teacher, semester: semester, exercise: exercise }
    });

    if (!exerciseGroupConnection) {
        exerciseGroupConnection = new ExerciseGroupConnection();
        exerciseGroupConnection.group = dto.groupUuid;
        exerciseGroupConnection.teacher = teacher;
        exerciseGroupConnection.exercise = exercise;
        exerciseGroupConnection.semester = semester;
        exerciseGroupConnection.createdAt = new Date();
    }

    exerciseGroupConnection.updatedAt = new Date();
    exerciseGroupConnection.exerciseType = exerciseType;
    exerciseGroupConnection.fromDate = new Date(dto.fromDate);
    exerciseGroupConnection.toDate = new Date(dto.toDate);
    exerciseGroupConnection.time = dto.time;
    exerciseGroupConnection.answerType = null;

    const res = await this.exerciseGroupConnectionRepository.save(exerciseGroupConnection);

    await Promise.all(dto.students.map(async (student) => {
        const findStudent = await this.authRepository.findOne({
            where: { id: student.id }
        });
        if (findStudent) {
            const findUserConnection = await this.exerciseUserConnectionRepository.findOne({
                where: { student: findStudent, connection: exerciseGroupConnection }, relations:['connection']
            });
            if (!findUserConnection) {
                const newUserConnection = new ExerciseUserConnection();
                newUserConnection.student = findStudent;
                newUserConnection.connection = exerciseGroupConnection;
                newUserConnection.dueDate = null;
                newUserConnection.isOpenAnswer = false;
                await this.exerciseUserConnectionRepository.save(newUserConnection);
            }
            let message = `נשלח ${exerciseType.title} ${exercise.title} `
            if(exerciseType.isDateable){
              const fromDate = new Date(findUserConnection.connection.fromDate);
              const toDate = new Date(findUserConnection.connection.toDate);

              const formattedFromDate = fromDate.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
              const formattedToDate = toDate.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

              message += `בתאריך ${formattedFromDate} לתאריך ${formattedToDate} `;
            }
            if(exerciseType.isTimeable){
              const connectionTime = new Date(findUserConnection.connection.time);
              const formattedTime = connectionTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
              message += `בשעה ${formattedTime} `;
            }

            const obj = {
              sendTo:[student.id],
              title: `נשלח ${exerciseType.title} ${exercise.title}`,
              description:message,
              
              type: MailTypeEnum.Original
            } as CreateMailDto
            this.MailService.create(obj,teacher.id)

            const checkIsStart = await this.StudentHistoryRepository.findOne({
              where:{student:student, exercise: exercise}
            })

            if(checkIsStart){
              checkIsStart.isDone = false
              checkIsStart.isFinalGrade = false
              checkIsStart.teacherGrade = 0
              this.StudentHistoryRepository.save(checkIsStart)
            }

      }
    }));

    return res;
}

  async createAnswer(answerConnectionId:string, dto:CreateExerciseGroupAnswerDto){
    const findConnection = await this.exerciseGroupConnectionRepository.findOne({
      where:{id:+answerConnectionId},
    })
    if(!findConnection) throw new BadRequestException('group connecion not found');
    
    findConnection.answerType = dto.answerType
    if(dto?.dueDate && dto?.time){
      findConnection.answerDate = dto?.dueDate
      findConnection.answerTime = dto?.time
    }

    await this.exerciseGroupConnectionRepository.save(findConnection)
    
    dto.students?.map(async (student) => {
      const find = await this.exerciseUserConnectionRepository.findOne({
        where:{student:student,connection:findConnection},
        relations:['connection','connection.exerciseType','connection.exercise','connection.teacher']
      })
      if(find){
        if(dto?.dueDate && dto?.time){
          find.dueDate = dto.dueDate
          find.answerTime = dto?.time
          find.isOpenAnswer = false
        } else {
          find.isOpenAnswer = true
        }
        await this.exerciseUserConnectionRepository.save(find)
        const obj = {
          sendTo:[student.id],
          title: `נפתחו תשובות ${find.connection.exerciseType.title} ${find.connection.exercise.title}`,
          description:`נפתחו תשובות ${find.connection.exerciseType.title} ${find.connection.exercise.title}`,
          
          type: MailTypeEnum.Original
        } as CreateMailDto
        this.MailService.create(obj,find.connection.teacher.id)
      }
    })

    return {status:"success",message:"data created"}
  }

  findAll() {
    return `This action returns all exerciseGroupConnection`;
  }

  async findOne(
    groupUuid: string,
    exerciseTypeId: string,
    exerciseId: string,
    teacherId: string
  ) {
    const findExerciseType = await this.exerciseTypeRepository.findOne({
      where:{title:exerciseTypeId}
    })

    if(!findExerciseType)  throw new BadRequestException('exerciseType not found');

    const exercise = await this.exerciseRepository.findOne({
      where:{id:+exerciseId}
    })

    if(!exercise)  throw new BadRequestException('exercise not found');

    const teacher = await this.authRepository.findOne({
      where:{id: +teacherId}
    })

    if(!teacher)  throw new BadRequestException('teacher not found');


    const res = await this.exerciseGroupConnectionRepository.findOne({
      where:{exercise: exercise, exerciseType: findExerciseType, teacher: teacher, group: groupUuid },
    });

    return res;
  }

  async findAllTeacherGroups(teacherId: string){
    const teacher = await this.authRepository.findOne({
      where:{id: +teacherId}
    })

    if(!teacher)  throw new BadRequestException('teacher not found');

    const results = await this.exerciseGroupConnectionRepository.find({
      where:{teacher: teacher},
      relations:['students','exercise','exerciseType', 'students.student']
    })
    
    const promises = results.map(async (item) => {
      const data = await this.findFullPathExercise(item?.exercise?.id)
      item.exercise.fullPath = data.name;
      item.exercise.fullLink = data.link;
      return item;
    });

    const updatedResults = await Promise.all(promises);

    return updatedResults;
  }

  update(id: number, updateExerciseGroupConnectionDto: UpdateExerciseGroupConnectionDto) {
    return `This action updates a #${id} exerciseGroupConnection`;
  }

  async remove(id: number) {
    return await this.exerciseGroupConnectionRepository.delete(id);
  }

  async removeAnswerGroup(id: number) {
    const find = await this.exerciseGroupConnectionRepository.findOne({
        where: { id: id },
        relations: ['students']
    });

    if (find) {
        find.answerDate = null;
        find.answerTime = null;
        find.answerType = null;
        for (const student of find.students) {
            student.dueDate = null;
            student.answerTime = null;
            student.isOpenAnswer = false;
            await this.exerciseUserConnectionRepository.save(student);
        }
        await this.exerciseGroupConnectionRepository.save(find);
    }
    return {status:"success",message:"data deleted"}
  }


  private async findFullPathExercise(id: number) {
    const exercise = await this.exerciseRepository
    .createQueryBuilder('exercise')
    .leftJoinAndSelect('exercise.course', 'course')
    .leftJoinAndSelect('course.parent', 'parent')
    .leftJoinAndSelect('parent.parent', 'grandparent')
    .leftJoinAndSelect('grandparent.parent', 'gradgrandparent')
    .leftJoinAndSelect('gradgrandparent.parent', 'grandgradgrandparent')
    .where('exercise.id = :id', { id })
    .getOne(); 
    return {
      name:`${exercise?.course?.parent?.parent?.parent?.parent?.name} / ${exercise?.course?.parent?.parent?.parent?.name} / ${exercise?.course?.parent?.parent?.name} / ${exercise?.course?.parent?.name} / ${exercise?.course?.name} / ${exercise?.title}`,
      link:`/teacher/exercise/${exercise?.course?.parent?.parent?.parent?.parent?.id}/${exercise?.course?.parent?.parent?.parent?.id}/${exercise?.course?.parent?.parent?.id}/${exercise?.course?.parent?.id}/${exercise?.course?.id}`
    }
    
  }
  
}

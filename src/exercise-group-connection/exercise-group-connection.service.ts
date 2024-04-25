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
  ){}
  async create(dto: CreateExerciseGroupConnectionDto) {

    const teacher = await this.authRepository.findOne({
      where:{id:+dto.teacherId}
    })

    if(!teacher) throw new BadRequestException('teacher not found');
    
    const exercise = await this.exerciseRepository.findOne({
      where:{id:+dto.exerciseId}
    })

    if(!exercise) throw new BadRequestException('teacher not found');

    const exerciseType = await this.exerciseTypeRepository.findOne({
      where:{title:dto.exerciseTypeId}
    })

    if(!exerciseType) throw new BadRequestException('exerciseType not found');

    const semester = await this.semesterRepository.findOne({
      where:{active:true}
    })

    const exerciseGroupConnection = await this.exerciseGroupConnectionRepository.findOne({
      where:{group: dto.groupUuid, exerciseType: exerciseType, teacher: teacher, fromDate: dto.fromDate, toDate:dto.toDate, semester: semester, exercise: exercise}
    })
    if(!exerciseGroupConnection){
      const exerciseGroupConnection = new ExerciseGroupConnection();
      exerciseGroupConnection.createdAt = new Date()
      exerciseGroupConnection.updatedAt = new Date()
      exerciseGroupConnection.exerciseType = exerciseType
      exerciseGroupConnection.exercise = exercise
      exerciseGroupConnection.group = dto.groupUuid
      exerciseGroupConnection.teacher = teacher
      exerciseGroupConnection.semester = semester
      exerciseGroupConnection.fromDate = new Date(dto.fromDate)
      exerciseGroupConnection.toDate = new Date(dto.toDate)
      exerciseGroupConnection.time = dto.time
      const res = await this.exerciseGroupConnectionRepository.save(exerciseGroupConnection)
      dto?.students?.map(async (student) => {
        const findStudent = await this.authRepository.findOne({
          where:{id:student.id}
        })
        if(findStudent){
          const findUserConnection = await this.exerciseUserConnectionRepository.findOne({
            where:{student: findStudent, connection:exerciseGroupConnection}
          })
          if(!findUserConnection){
              const findUserConnection = new ExerciseUserConnection();
              findUserConnection.student = findStudent
              findUserConnection.connection = exerciseGroupConnection
              await this.exerciseUserConnectionRepository.save(findUserConnection)
          }
        }
      })
      return res
    }
    return exerciseGroupConnection
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
      where:{exercise: exercise, exerciseType: findExerciseType, teacher: teacher, group: groupUuid }
    });

    return res;
  }

  update(id: number, updateExerciseGroupConnectionDto: UpdateExerciseGroupConnectionDto) {
    return `This action updates a #${id} exerciseGroupConnection`;
  }

  async remove(id: number) {
    return await this.exerciseGroupConnectionRepository.delete(id);
  }
}

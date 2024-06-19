import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from 'src/school/entities/school.entity';
import { Class } from 'src/class/entities/class.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { Group } from './entities/group.entity';
import { v4 as uuidv4 } from 'uuid';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { CourseEntity } from 'src/course/entities/course.entity';

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(ExerciseGroupConnection)
    private readonly exerciseGroupConnectionRepository: Repository<ExerciseGroupConnection>,
    @InjectRepository(StudentHistory)
    private readonly studentHistoryRepository: Repository<StudentHistory>,
    @InjectRepository(ExerciseEntity)
    private readonly exerciseEntity: Repository<ExerciseEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>
  ){}


  async create(teacherId: number, createGroupDto: CreateGroupDto, isRecursive: boolean, uuidEx?: string) {
    const findTeacher = await this.authRepository.findOne({
      where:{id:teacherId}
    })
    if (!findTeacher) throw new BadRequestException('teacher with this id not found');

    let uuid = uuidv4();
    if(createGroupDto?.classes.length > 0) {
      createGroupDto.classes.map(async (item) => {

        const findClass = await this.classRepository.findOne({
          where:{id:+item},
          relations:['students']
        })
        if(!findClass) throw new BadRequestException(`class with this id ${item} not found.`);

        findClass.students.map(async (student) => {

          const findExistGroup = await this.groupRepository.findOne({
            where:{role: createGroupDto.role, class: findClass, student: student, teacher: findTeacher, title: createGroupDto.title}
          })

          const newGroup = new Group();
          newGroup.class = findClass
          newGroup.role = createGroupDto.role
          newGroup.student = student
          newGroup.teacher = findTeacher
          newGroup.title = createGroupDto.title ? createGroupDto.title : findClass.title
          newGroup.privilage = createGroupDto.privilageType
          newGroup.uuid = createGroupDto.isUnique ? `${uuidEx ? uuidEx : uuid}-${findClass.id}` : uuidEx ? uuidEx : uuid
          const res = await this.groupRepository.save(newGroup)
        })
      })
    } else {
      createGroupDto.students.map(async (item) => {
        const findStudent = await this.authRepository.findOne({
          where:{id:+item},
          relations:['class']
        })
        if(!findStudent) throw new BadRequestException(`student with this id ${item} not found.`);

          
          const newGroup = new Group();
          newGroup.class = findStudent.class
          newGroup.role = createGroupDto.role
          newGroup.student = findStudent
          newGroup.teacher = findTeacher
          newGroup.title = createGroupDto.title
          newGroup.privilage = createGroupDto.privilageType
          newGroup.uuid = uuidEx ? uuidEx : uuid
          const res = await this.groupRepository.save(newGroup)
      })
    }

    if(isRecursive){
      createGroupDto?.teachers?.map((teacher) =>{
        if(findTeacher.id !== +teacher){
          this.create(+teacher, createGroupDto, false, uuidEx ? uuidEx : uuid)
        }
      })
    }


    return {status:'success'};
  }

  findAll() {
    return `This action returns all group`;
  }

  async findGroupsByTeacher(teacherId: number) {
    const res = await this.getByTeacherIdGroups(teacherId);
  
    const result = await Promise.all(res.map(async (item) => {
      const dataGroup = await this.groupRepository.findOne({
        where: { uuid: item.uuid },
        relations:['class']
      });
      const students = await this.groupRepository.find({
        where: { uuid: item.uuid },
        relations: ['student','teacher'],
      });
      const findConnectionGroup = await this.exerciseGroupConnectionRepository.findOne({
        where:{group: item.uuid},
        relations:['exerciseType']
      })
  
      const uniqueStudents = Array.from(new Set(students.map(student => student.student.id))).map(id => students.find(s => s.student.id === id));
      const uniqueTeachers = Array.from(new Set(students.map(teacher => teacher.teacher.id))).map(id => students.find(t => t.teacher.id === id));
  
      return {
        uuid: item.uuid,
        title: dataGroup.title ?? '',
        students: uniqueStudents.map((student) => student.student),
        teachers: uniqueTeachers.map((teacher) => teacher.teacher),
        connection:findConnectionGroup ?? {}
      };
    }));
  
    return result;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }

  private async getByTeacherIdGroups(teacherId: number){
    const findTeacher = await this.authRepository.findOne({
      where: { id: teacherId }
    });
  
    if (!findTeacher) {
      throw new BadRequestException('Teacher with this ID not found');
    }
  
    const queryBuilder = this.groupRepository.createQueryBuilder('group');
    const subQuery = queryBuilder
      .subQuery()
      .select('DISTINCT(group.uuid)')
      .from('group', 'group')
      .where('group.teacher = :teacherId', { teacherId: findTeacher.id })
      .getQuery();
  
    const groups = await queryBuilder
      .select('group.uuid', 'uuid')
      .leftJoin('group.class', 'class')
      .where(`group.uuid IN ${subQuery}`)
      .groupBy('group.uuid')
      .getRawMany();

    return groups
  }

  async getGroupStatistic(groupId: string, courseId: number) {

    const findCourse = await this.courseRepository.findOne({
      where:{id:courseId}
    })

    if (!findCourse) {
      throw new BadRequestException(`course with this id ${courseId} not found.`);
    }

    const findExercise = await this.exerciseEntity.findOne({
      where: { course: findCourse }
    });
  
    if (!findExercise) {
      throw new BadRequestException(`Exercise not found.`);
    }
  
    const findGroup = await this.groupRepository.find({
      where: { uuid: groupId },
      relations: ['student']
    });
  
    let totalStudent = 0;
    let totalStartWorking = 0;
    let totalCompleted = 0;
    let totalGrade = 0;
    let totalWaitingCheck = 0
    let averageGrade = 0;
  
    if (findGroup) {
      const promises = findGroup.map(async (item) => {
        totalStudent++;
        const exercise = await this.studentHistoryRepository.findOne({
          where: { student: item.student, exercise: findExercise }
        });
  
        if (exercise) {
          totalStartWorking++;
          if (exercise.grade > 0) {
            totalCompleted++;
            totalGrade += exercise.grade;
          }

          if(exercise.isDone && !exercise?.teacherGrade){
            totalWaitingCheck++
          }

        }
      });
  
      // Wait for all promises to resolve using Promise.all
      await Promise.all(promises);
    }
  
    if (totalStudent > 0) {
      averageGrade = totalGrade / totalStudent;
    }
  
    return {
      totalStudent,
      totalStartWorking,
      totalWaitingCheck,
      totalCompleted,
      totalGrade,
      averageGrade: averageGrade.toFixed(2)
    };
  }
  
}

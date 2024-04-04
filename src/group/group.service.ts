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
  
      const uniqueStudents = Array.from(new Set(students.map(student => student.student.id))).map(id => students.find(s => s.student.id === id));
      const uniqueTeachers = Array.from(new Set(students.map(teacher => teacher.teacher.id))).map(id => students.find(t => t.teacher.id === id));
  
      return {
        uuid: item.uuid,
        title: dataGroup.title ?? '',
        students: uniqueStudents.map((student) => student.student),
        teachers: uniqueTeachers.map((teacher) => teacher.teacher)
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
}

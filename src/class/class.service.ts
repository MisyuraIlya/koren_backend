import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { School } from 'src/school/entities/school.entity';

@Injectable()
export class ClassService {

  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ){}

  create(createClassDto: CreateClassDto) {
    return 'This action adds a new class';
  }

  findAll() {
    return `This action returns all class`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }

  async findBySchoolId(id: number){
    const school = await this.schoolRepository.findOne({
        where:{id: id}
    })
    if (!school) throw new BadRequestException('school not found with this id');

    const classes = await this.classRepository
    .createQueryBuilder('class')
    .leftJoinAndSelect('class.students', 'students')
    .leftJoinAndSelect('students.school', 'studentSchool')
    .leftJoinAndSelect('students.class', 'studentClass')
    .leftJoinAndSelect('class.school', 'school')
    .where(`school.id = ${school.id}`)
    .getMany()
    return classes;
  }
}

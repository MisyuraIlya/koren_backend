import { Injectable } from '@nestjs/common';
import { CreateStudentHistoryDto } from './dto/create-student-history.dto';
import { UpdateStudentHistoryDto } from './dto/update-student-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentHistory } from './entities/student-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentHistoryService {
  constructor(
    @InjectRepository(StudentHistory)
    private readonly studentHistoryRepository: Repository<StudentHistory>,

  ){}

  create(createStudentHistoryDto: CreateStudentHistoryDto) {
    return 'This action adds a new studentHistory';
  }

  findAll() {
    return `This action returns all studentHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentHistory`;
  }

  async update(id: number, updateStudentHistoryDto: UpdateStudentHistoryDto) {
    const find = await this.studentHistoryRepository.findOne({
      where:{id:id}
    })

    if(find) {
      find.isDone = updateStudentHistoryDto.isDone 
      return this.studentHistoryRepository.save(find)
    }

  }

  remove(id: number) {
    return `This action removes a #${id} studentHistory`;
  }
}

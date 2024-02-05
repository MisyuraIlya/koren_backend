import { Injectable } from '@nestjs/common';
import { CreateStudentHistoryDto } from './dto/create-student-history.dto';
import { UpdateStudentHistoryDto } from './dto/update-student-history.dto';

@Injectable()
export class StudentHistoryService {
  create(createStudentHistoryDto: CreateStudentHistoryDto) {
    return 'This action adds a new studentHistory';
  }

  findAll() {
    return `This action returns all studentHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentHistory`;
  }

  update(id: number, updateStudentHistoryDto: UpdateStudentHistoryDto) {
    return `This action updates a #${id} studentHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentHistory`;
  }
}

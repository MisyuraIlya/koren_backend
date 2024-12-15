import { Injectable } from '@nestjs/common';
import { CreateCustomAnswerDto } from './dto/create-custom-answer.dto';
import { UpdateCustomAnswerDto } from './dto/update-custom-answer.dto';

@Injectable()
export class CustomAnswersService {
  create(createCustomAnswerDto: CreateCustomAnswerDto) {
    return 'This action adds a new customAnswer';
  }

  findAll() {
    return `This action returns all customAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customAnswer`;
  }

  update(id: number, updateCustomAnswerDto: UpdateCustomAnswerDto) {
    return `This action updates a #${id} customAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customAnswer`;
  }
}

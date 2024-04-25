import { Injectable } from '@nestjs/common';
import { CreateExerciseUserConnectionDto } from './dto/create-exercise-user-connection.dto';
import { UpdateExerciseUserConnectionDto } from './dto/update-exercise-user-connection.dto';

@Injectable()
export class ExerciseUserConnectionService {
  create(createExerciseUserConnectionDto: CreateExerciseUserConnectionDto) {
    return 'This action adds a new exerciseUserConnection';
  }

  findAll() {
    return `This action returns all exerciseUserConnection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseUserConnection`;
  }

  update(id: number, updateExerciseUserConnectionDto: UpdateExerciseUserConnectionDto) {
    return `This action updates a #${id} exerciseUserConnection`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseUserConnection`;
  }
}

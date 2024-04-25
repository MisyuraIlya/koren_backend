import { Injectable } from '@nestjs/common';
import { CreateExerciseTypeDto } from './dto/create-exercise-type.dto';
import { UpdateExerciseTypeDto } from './dto/update-exercise-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseType } from './entities/exercise-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExerciseTypeService {

  constructor(
    @InjectRepository(ExerciseType)
    private readonly exerciseTypeRepository: Repository<ExerciseType>,

){}
  create(createExerciseTypeDto: CreateExerciseTypeDto) {
    return 'This action adds a new exerciseType';
  }

  findAll() {
     return this.exerciseTypeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseType`;
  }

  update(id: number, updateExerciseTypeDto: UpdateExerciseTypeDto) {
    return `This action updates a #${id} exerciseType`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseType`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateExerciseUserConnectionDto } from './dto/create-exercise-user-connection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseUserConnection } from './entities/exercise-user-connection.entity';

@Injectable()
export class ExerciseUserConnectionService {

  constructor(
    @InjectRepository(ExerciseUserConnection)
    private readonly exerciseUserConnectionRepository: Repository<ExerciseUserConnection>,
  ){}

  create(createExerciseUserConnectionDto: CreateExerciseUserConnectionDto) {
    return 'This action adds a new exerciseUserConnection';
  }

  findAll() {
    return `This action returns all exerciseUserConnection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseUserConnection`;
  }

  async resendExercise(id: number) {
    const find = await this.exerciseUserConnectionRepository.findOne({
      where:{id:id}
    })
    
    find.isDone = false
    find.isResend = true
    this.exerciseUserConnectionRepository.save(find)
    return find;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseUserConnection`;
  }
}

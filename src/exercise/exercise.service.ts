import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExerciseEntity } from './entities/exercise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExerciseService {

    constructor(
        @InjectRepository(ExerciseEntity)
        private readonly exerciseRepository: Repository<ExerciseEntity>,
    ){}

    create(dto: CreateExerciseDto) {
        return 'This action adds a new task';
    }

    async findOne(id: number): Promise<ExerciseEntity> {
        const exercise = await this.exerciseRepository
        .createQueryBuilder('exercise')
        .leftJoinAndSelect('exercise.course', 'course')
        .leftJoinAndSelect('exercise.tabs', 'tabs')
        .leftJoinAndSelect('tabs.tasks', 'tasks')
        .leftJoinAndSelect('tasks.columns', 'columns')
        .leftJoinAndSelect('tasks.rows', 'rows')
        .leftJoinAndSelect('rows.objectives', 'objectives')
        .leftJoinAndSelect('objectives.answers', 'answers')
        .leftJoinAndSelect('objectives.values', 'values')
        .where('course.id = :id', {id})
        .orderBy('tabs.orden', 'ASC')
        .addOrderBy('tasks.orden', 'ASC')
        .addOrderBy('columns.orden', 'ASC')
        .addOrderBy('rows.orden', 'ASC')
        .addOrderBy('objectives.orden', 'ASC')
        .getOne();
        return exercise;
    }

    async remove(id: number): Promise<void> {
        const exercise = await this.exerciseRepository.findOneBy({id})

        if (!exercise) {
            throw new BadRequestException('Exercise not found');
          }

        await this.exerciseRepository.remove(exercise)
    }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExerciseEntity } from './entities/exercise.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExerciseService {

    constructor(
        @InjectRepository(ExerciseEntity)
        private readonly exerciseRepository: Repository<ExerciseEntity>,
    ){}


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
}

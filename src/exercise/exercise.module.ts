import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseEntity } from './entities/exercise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { TabEntity } from 'src/tab/entities/tab.entity';
import { TaskEntity } from 'src/task/entities/task.entity';
import { ColumnTaskEntity } from 'src/column_task/entities/columnTask.entity';
import { RowTaskEntity } from 'src/row_task/entities/rowTask.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { ValueEntity } from 'src/value/entities/value.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseEntity,CourseEntity, TabEntity, TaskEntity, ColumnTaskEntity, RowTaskEntity, ObjectiveEntity, AnswerEntity, ValueEntity,ExerciseGroupConnection])],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}

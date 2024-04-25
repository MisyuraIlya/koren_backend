import { Module } from '@nestjs/common';
import { ExerciseTypeService } from './exercise-type.service';
import { ExerciseTypeController } from './exercise-type.controller';
import { ExerciseType } from './entities/exercise-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseType])],
  controllers: [ExerciseTypeController],
  providers: [ExerciseTypeService],
})
export class ExerciseTypeModule {}

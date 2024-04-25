import { Module } from '@nestjs/common';
import { ExerciseUserConnectionService } from './exercise-user-connection.service';
import { ExerciseUserConnectionController } from './exercise-user-connection.controller';
import { ExerciseUserConnection } from './entities/exercise-user-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseUserConnection])],
  controllers: [ExerciseUserConnectionController],
  providers: [ExerciseUserConnectionService],
})
export class ExerciseUserConnectionModule {}

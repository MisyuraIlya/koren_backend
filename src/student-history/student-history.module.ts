import { Module } from '@nestjs/common';
import { StudentHistoryService } from './student-history.service';
import { StudentHistoryController } from './student-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentHistory } from './entities/student-history.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentHistory,AuthEntity,ExerciseEntity,ExerciseGroupConnection,ExerciseUserConnection])],
  controllers: [StudentHistoryController],
  providers: [StudentHistoryService],
})
export class StudentHistoryModule {}

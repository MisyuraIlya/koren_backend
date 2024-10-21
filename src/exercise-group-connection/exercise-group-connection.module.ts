import { Module } from '@nestjs/common';
import { ExerciseGroupConnectionService } from './exercise-group-connection.service';
import { ExerciseGroupConnectionController } from './exercise-group-connection.controller';
import { ExerciseGroupConnection } from './entities/exercise-group-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { Group } from 'src/group/entities/group.entity';
import { ExerciseType } from 'src/exercise-type/entities/exercise-type.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';
import { ExerciseService } from 'src/exercise/exercise.service';
import { MailModule } from 'src/mail/mail.module';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseGroupConnection,AuthEntity,Group,ExerciseType, Semester ,ExerciseEntity,ExerciseUserConnection,StudentHistory]),MailModule],
  controllers: [ExerciseGroupConnectionController],
  providers: [ExerciseGroupConnectionService],
})
export class ExerciseGroupConnectionModule {}

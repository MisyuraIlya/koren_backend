import { Module } from '@nestjs/common';
import { ExerciseUserConnectionService } from './exercise-user-connection.service';
import { ExerciseUserConnectionController } from './exercise-user-connection.controller';
import { ExerciseUserConnection } from './entities/exercise-user-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseUserConnection]), MailModule],
  controllers: [ExerciseUserConnectionController],
  providers: [ExerciseUserConnectionService],
})
export class ExerciseUserConnectionModule {}

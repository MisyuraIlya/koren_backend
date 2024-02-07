import { Module } from '@nestjs/common';
import { StudentAnswerService } from './student-answer.service';
import { StudentAnswerController } from './student-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/student-answer.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAnswer,AuthEntity, AnswerEntity, StudentHistory])],
  controllers: [StudentAnswerController],
  providers: [StudentAnswerService],
})
export class StudentAnswerModule {}

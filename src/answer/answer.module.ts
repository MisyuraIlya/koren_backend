import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerEntity])],
  controllers: [AnswerController],
  providers: [AnswerService],
})

export class AnswerModule {}

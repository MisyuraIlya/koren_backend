import { Module } from '@nestjs/common';
import { CustomAnswersService } from './custom-answers.service';
import { CustomAnswersController } from './custom-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomAnswer } from './entities/custom-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomAnswer])],
  controllers: [CustomAnswersController],
  providers: [CustomAnswersService],
})
export class CustomAnswersModule {}

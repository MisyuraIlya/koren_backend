import { Module } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { ConfirmationController } from './confirmation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confirmation } from './entities/confirmation.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { CourseEntity } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Confirmation,AuthEntity,CourseEntity])],
  controllers: [ConfirmationController],
  providers: [ConfirmationService],
})
export class ConfirmationModule {}

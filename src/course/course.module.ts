import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity,AuthEntity])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

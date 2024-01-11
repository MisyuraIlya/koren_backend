import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './entities/course.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll(): Promise<CourseEntity[]> {
    return this.courseService.findAll();
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createTaskDto: CreateCourseDto) {
    return this.courseService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<CourseEntity[]> {
    return this.courseService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }

  @Post('/sortable')
  sortable(@Body() dto: CourseEntity[]) {
    return this.courseService.sortable(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateDto);
  }
}

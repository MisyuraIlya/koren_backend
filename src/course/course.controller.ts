import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AdminRoleGuard } from 'src/auth/guard/admin-role.gard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AdminRoleGuard)
  @Post()
  create(@Body() createTaskDto: CreateCourseDto) {
    return this.courseService.create(createTaskDto);
  }

  @SkipThrottle()
  @Get(':userId')
  findAll(@Param('userId') userId: string): Promise<CourseEntity[]> {
    return this.courseService.findAll(userId);
  }

  @UseGuards(AdminRoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }

  @UseGuards(AdminRoleGuard)
  @Post('/sortable')
  sortable(@Body() dto: CourseEntity[]) {
    return this.courseService.sortable(dto);
  }

  @UseGuards(AdminRoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateDto);
  }
}

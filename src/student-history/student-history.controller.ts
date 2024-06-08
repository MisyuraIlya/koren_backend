import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentHistoryService } from './student-history.service';
import { CreateStudentHistoryDto } from './dto/create-student-history.dto';
import { UpdateStudentHistoryDto } from './dto/update-student-history.dto';

@Controller('student-history')
export class StudentHistoryController {
  constructor(private readonly studentHistoryService: StudentHistoryService) {}

  @Post()
  create(@Body() createStudentHistoryDto: CreateStudentHistoryDto) {
    return this.studentHistoryService.create(createStudentHistoryDto);
  }

  @Get()
  findAll() {
    return this.studentHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentHistoryDto: UpdateStudentHistoryDto) {
    return this.studentHistoryService.update(+id, updateStudentHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentHistoryService.remove(+id);
  }


}

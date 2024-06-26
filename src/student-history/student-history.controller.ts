import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentHistoryService } from './student-history.service';
import { CreateStudentHistoryDto } from './dto/create-student-history.dto';

import { UpdateManualGradeDto } from './dto/update-manual-grade';
import { UpdateStudentHistoryDto } from './dto/update-manual-grade.dto';
import { UpdateTeacherGrade } from './dto/update-teacher-grade.dto';

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

  @Patch('manualGrade/:id')
  updateManualGrade(@Param('id') id: string, @Body() UpdateManualGradeDto: UpdateManualGradeDto) {
    return this.studentHistoryService.updateManualGrade(+id, UpdateManualGradeDto);
  }

  @Patch('teacherGrade/:id')
  teacherGradeUpdate(@Param('id') id: string, @Body() UpdateTeacherGrade: UpdateTeacherGrade) {
    return this.studentHistoryService.teacherGradeUpdate(+id, UpdateTeacherGrade);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentHistoryService.remove(+id);
  }

  @Get('/statistic/:uuidGroup/:lvl1/:lvl2/:lvl3/:lvl4/:lvl5')
  getStasitic(
    @Param('uuidGroup') uuidGroup: string,
    @Param('lvl1') lvl1: string,
    @Param('lvl2') lvl2: string,
    @Param('lvl3') lvl3: string,
    @Param('lvl4') lvl4: string,
    @Param('lvl5') lvl5: string,
    
  ){
    return this.studentHistoryService.getStatistic(
      uuidGroup,
      +lvl1,
      +lvl2,
      +lvl3,
      +lvl4,
      +lvl5
    );
  }


}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentAnswerService } from './student-answer.service';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { UpdateStudentAnswerDto } from './dto/update-student-answer.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('student-answer')
export class StudentAnswerController {
  constructor(private readonly studentAnswerService: StudentAnswerService) {}

  @Post(':id/:studentId/:historyId')
  handleAnswer(
      @Param('id') id: string, 
      @Param('studentId') studentId: string , 
      @Param('historyId') historyId: string ,  
      @Body() createStudentAnswerDto: CreateStudentAnswerDto
    ) {
    return this.studentAnswerService.handleAnswer(+id, +studentId, +historyId, createStudentAnswerDto);
  }

  @Get()
  @SkipThrottle()
  findAll() {
    return this.studentAnswerService.findAll();
  }

  @Get(':id')
  @SkipThrottle()
  findOne(@Param('id') id: string) {
    return this.studentAnswerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentAnswerDto: UpdateStudentAnswerDto) {
    return this.studentAnswerService.update(+id, updateStudentAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentAnswerService.remove(+id);
  }
}

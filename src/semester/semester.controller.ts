import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @SkipThrottle()
  @Get()
  findAll() {
    return this.semesterService.findAll();
  }
  
  @SkipThrottle()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semesterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSemesterDto: UpdateSemesterDto) {
    return this.semesterService.update(+id, updateSemesterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semesterService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseTypeService } from './exercise-type.service';
import { CreateExerciseTypeDto } from './dto/create-exercise-type.dto';
import { UpdateExerciseTypeDto } from './dto/update-exercise-type.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('exercise-type')
export class ExerciseTypeController {
  constructor(private readonly exerciseTypeService: ExerciseTypeService) {}

  @Post()
  create(@Body() createExerciseTypeDto: CreateExerciseTypeDto) {
    return this.exerciseTypeService.create(createExerciseTypeDto);
  }

  @SkipThrottle()
  @Get()
  findAll() {
    return this.exerciseTypeService.findAll();
  }

  @SkipThrottle()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseTypeDto: UpdateExerciseTypeDto) {
    return this.exerciseTypeService.update(+id, updateExerciseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseTypeService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseUserConnectionService } from './exercise-user-connection.service';
import { CreateExerciseUserConnectionDto } from './dto/create-exercise-user-connection.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('exercise-user-connection')
export class ExerciseUserConnectionController {
  constructor(private readonly exerciseUserConnectionService: ExerciseUserConnectionService) {}

  @Post()
  create(@Body() createExerciseUserConnectionDto: CreateExerciseUserConnectionDto) {
    return this.exerciseUserConnectionService.create(createExerciseUserConnectionDto);
  }

  @SkipThrottle()
  @Get()
  findAll() {
    return this.exerciseUserConnectionService.findAll();
  }

  @SkipThrottle()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseUserConnectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.exerciseUserConnectionService.resendExercise(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseUserConnectionService.remove(+id);
  }
}

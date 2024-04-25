import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseGroupConnectionService } from './exercise-group-connection.service';
import { CreateExerciseGroupConnectionDto } from './dto/create-exercise-group-connection.dto';
import { UpdateExerciseGroupConnectionDto } from './dto/update-exercise-group-connection.dto';

@Controller('exercise-group-connection')
export class ExerciseGroupConnectionController {
  constructor(private readonly exerciseGroupConnectionService: ExerciseGroupConnectionService) {}

  @Post()
  create(@Body() createExerciseGroupConnectionDto: CreateExerciseGroupConnectionDto) {
    return this.exerciseGroupConnectionService.create(createExerciseGroupConnectionDto);
  }

  @Get()
  findAll() {
    return this.exerciseGroupConnectionService.findAll();
  }

  @Get(':groupUuid/:exerciseTypeId/:exerciseId/:teacherId')
  findOne(
    @Param('groupUuid') groupUuid: string,
    @Param('exerciseTypeId') exerciseTypeId: string,
    @Param('exerciseId') exerciseId: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.exerciseGroupConnectionService.findOne(
      groupUuid,
      exerciseTypeId,
      exerciseId,
      teacherId
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseGroupConnectionDto: UpdateExerciseGroupConnectionDto) {
    return this.exerciseGroupConnectionService.update(+id, updateExerciseGroupConnectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseGroupConnectionService.remove(+id);
  }
}

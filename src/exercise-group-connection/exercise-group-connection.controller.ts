import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseGroupConnectionService } from './exercise-group-connection.service';
import { CreateExerciseGroupConnectionDto } from './dto/create-exercise-group-connection.dto';
import { UpdateExerciseGroupConnectionDto } from './dto/update-exercise-group-connection.dto';
import { CreateExerciseGroupAnswerDto } from './dto/create-exercise-group-answer.dto';

@Controller('exercise-group-connection')
export class ExerciseGroupConnectionController {
  constructor(private readonly exerciseGroupConnectionService: ExerciseGroupConnectionService) {}

  @Post()
  create(@Body() createExerciseGroupConnectionDto: CreateExerciseGroupConnectionDto) {
    return this.exerciseGroupConnectionService.create(createExerciseGroupConnectionDto);
  }

  @Post('/answer/:id')
  createAnswer(@Param('id') id: string, @Body() dto: CreateExerciseGroupAnswerDto) {
    return this.exerciseGroupConnectionService.createAnswer(id,dto);
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

  @Get('/teacher/:teacherId')
  findTeacherGroups(
    @Param('teacherId') teacherId: string,
  ) {
    return this.exerciseGroupConnectionService.findAllTeacherGroups(teacherId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseGroupConnectionDto: UpdateExerciseGroupConnectionDto) {
    return this.exerciseGroupConnectionService.update(+id, updateExerciseGroupConnectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseGroupConnectionService.remove(+id);
  }

  @Delete('/answer/:id')
  removeAnswerGroup(@Param('id') id: string) {
    return this.exerciseGroupConnectionService.removeAnswerGroup(+id);
  }
}

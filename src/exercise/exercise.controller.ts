import { AdminRoleGuard } from 'src/auth/guard/admin-role.gard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseEntity } from './entities/exercise.entity';
import { ExerciseService } from './exercise.service';
import { Controller, Get, Param,Post,Put,Delete,Body,UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, UseGuards, Patch } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('exercise')
export class ExerciseController {

  constructor(private readonly exerciseService: ExerciseService) {}

  @UseGuards(AdminRoleGuard)
  @SkipThrottle()
  @Post()
  create(@Body() createTaskDto: CreateExerciseDto) {
    return this.exerciseService.create(createTaskDto);
  }
  
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exerciseService.update(+id, updateExerciseDto);
  }

  @SkipThrottle()
  @Get(':id')
  async Read(@Param('id') id: number): Promise<ExerciseEntity> {
    return await this.exerciseService.findOne(id)
  }

  @SkipThrottle()
  @Get(':id/:studentId')
  async ReadStudent(@Param('id') id: number, @Param('studentId') studentId: number): Promise<ExerciseEntity> {
    return await this.exerciseService.findOneByStudent(id,studentId)
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.exerciseService.remove(+id);
  }


  @Patch('boldChanger/:id')
  updateBoldChanger(@Param('id') id: number, @Body('value') value: string) {
    return this.exerciseService.boldChanger(+id, value);
  }
}

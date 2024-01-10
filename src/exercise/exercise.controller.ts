import { ExerciseEntity } from './entities/exercise.entity';
import { ExerciseService } from './exercise.service';
import { Controller, Get, Param,Post,Put,Delete,Body,UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, UseGuards } from '@nestjs/common';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get(':id')
  async Read(@Param('id') id: number): Promise<ExerciseEntity> {
    return await this.exerciseService.findOne(id)
  }

}

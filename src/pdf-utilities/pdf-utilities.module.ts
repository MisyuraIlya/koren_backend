import { Module } from '@nestjs/common';
import { PdfUtilitiesService } from './pdf-utilities.service';
import { PdfUtilitiesController } from './pdf-utilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfUtilitiesEntity } from './entities/pdf-utility.entity';
import { CourseEntity } from 'src/course/entities/course.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PdfUtilitiesEntity, ExerciseEntity])],
  controllers: [PdfUtilitiesController],
  providers: [PdfUtilitiesService],
})
export class PdfUtilitiesModule {}

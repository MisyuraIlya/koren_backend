import { Module } from '@nestjs/common';
import { PdfUtilitiesService } from './pdf-utilities.service';
import { PdfUtilitiesController } from './pdf-utilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfUtilitiesEntity } from './entities/pdf-utility.entity';
import { CourseEntity } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PdfUtilitiesEntity, CourseEntity])],
  controllers: [PdfUtilitiesController],
  providers: [PdfUtilitiesService],
})
export class PdfUtilitiesModule {}

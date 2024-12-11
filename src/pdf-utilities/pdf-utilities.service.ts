import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePdfUtilityDto } from './dto/create-pdf-utility.dto';
import { UpdatePdfUtilityDto } from './dto/update-pdf-utility.dto';
import { PdfUtilitiesEntity } from './entities/pdf-utility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';

@Injectable()
export class PdfUtilitiesService {
  constructor(
    @InjectRepository(PdfUtilitiesEntity)
    private readonly pdfUtilitiesRepository: Repository<PdfUtilitiesEntity>,

    @InjectRepository(ExerciseEntity)
    private readonly exerciseEntity: Repository<ExerciseEntity>,
  ){}

  async create(id: number, dto: CreatePdfUtilityDto) {
    try {
      // Find the associated exercise
      const exercise = await this.exerciseEntity.findOne({ where: { id } });
      if (!exercise) {
        throw new BadRequestException(`Exercise with id ${id} not found.`);
      }

      // Determine the next `orden` value
      const maxOrden = await this.pdfUtilitiesRepository
        .createQueryBuilder('pdfUtility')
        .select('MAX(pdfUtility.orden)', 'max')
        .where('pdfUtility.exerciseId = :exerciseId', { exerciseId: id })
        .getRawOne();

      const nextOrden = (maxOrden?.max ?? 0) + 1;
      console.log('nextOrden',nextOrden)
      // Create the new PDF utility
      const pdfUtility = new PdfUtilitiesEntity();
      pdfUtility.name = dto.title;
      pdfUtility.exercise = exercise;
      pdfUtility.pdf = dto.pdf;
      pdfUtility.orden = dto.orden ? dto.orden : nextOrden;

      const savedPdfUtility = await this.pdfUtilitiesRepository.save(pdfUtility);
      return savedPdfUtility;
    } catch (error) {
      throw new BadRequestException(`Unable to create PDF utility. ${error.message}`);
    }
  }
  
  async remove(id: number) {
    try {
        const pdfUtility = await this.pdfUtilitiesRepository.findOne({
            where: { id: id },
        });

        if (!pdfUtility) {
            throw new BadRequestException(`PDF utility with id ${id} not found.`);
        }

        const res = await this.pdfUtilitiesRepository.remove(pdfUtility);
    } catch (error) {
        throw new BadRequestException(`Error deleting PDF utility: ${error.message}`);
    }
  }

  async sortable(dto: PdfUtilitiesEntity[]): Promise<void> {
      for (const course of dto) {
        const existing = await this.pdfUtilitiesRepository.findOne({
          where:{id:course.id}
        });
        console.log('existing',existing)
        if (existing) {
          existing.orden = course.orden;
          await this.pdfUtilitiesRepository.save(existing);
        }
      }
  }
}

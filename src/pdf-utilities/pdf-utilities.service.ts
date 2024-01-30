import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePdfUtilityDto } from './dto/create-pdf-utility.dto';
import { UpdatePdfUtilityDto } from './dto/update-pdf-utility.dto';
import { PdfUtilitiesEntity } from './entities/pdf-utility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PdfUtilitiesService {
  constructor(
    @InjectRepository(PdfUtilitiesEntity)
    private readonly pdfUtilitiesRepository: Repository<PdfUtilitiesEntity>,

    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
  ){}

  async create(id: number, dto: CreatePdfUtilityDto) {
      try {
          const course = await this.coursesRepository.findOne({
              where: {id:id}
          })
          if (!course) {
              throw new BadRequestException(`Course with id ${id} not found.`);
          }
          const pdfUtility = new PdfUtilitiesEntity();
          pdfUtility.name = dto.title; 
          pdfUtility.course = course;
          pdfUtility.pdf = dto.pdf
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

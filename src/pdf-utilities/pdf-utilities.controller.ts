import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PdfUtilitiesService } from './pdf-utilities.service';
import { CreatePdfUtilityDto } from './dto/create-pdf-utility.dto';
import { PdfUtilitiesEntity } from './entities/pdf-utility.entity';

@Controller('pdf-utilities')
export class PdfUtilitiesController {
  constructor(private readonly pdfUtilitiesService: PdfUtilitiesService) {}

  @Post('/:courseId')
  create(
    @Param('courseId') id: string,
    @Body() createPdfUtilityDto: CreatePdfUtilityDto
    ) {
    return this.pdfUtilitiesService.create(+id, createPdfUtilityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.pdfUtilitiesService.remove(+id);
  }

  @Put('/sortable')
  sortable(@Body() dto: PdfUtilitiesEntity[]) {
    return this.pdfUtilitiesService.sortable(dto);
  }

}

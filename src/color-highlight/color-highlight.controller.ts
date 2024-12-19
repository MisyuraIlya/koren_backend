import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColorHighlightService } from './color-highlight.service';
import { CreateColorHighlightDto } from './dto/create-color-highlight.dto';
import { UpdateColorHighlightDto } from './dto/update-color-highlight.dto';

@Controller('colorHighlight')
export class ColorHighlightController {
  constructor(private readonly colorHighlightService: ColorHighlightService) {}

  @Post(':userId/:exerciseId')
  create(
    @Param('userId') userId: number,
    @Param('exerciseId') exerciseId: number,
    @Body() createColorHighlightDto: CreateColorHighlightDto
  ) {
    console.log('heree')
    return this.colorHighlightService.create(userId, exerciseId,createColorHighlightDto);
  }

  @Get()
  findAll() {
    return this.colorHighlightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorHighlightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorHighlightDto: UpdateColorHighlightDto) {
    return this.colorHighlightService.update(+id, updateColorHighlightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorHighlightService.remove(+id);
  }
}

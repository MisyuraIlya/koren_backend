import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnkownWordsService } from './unkown-words.service';
import { CreateUnkownWordDto } from './dto/create-unkown-word.dto';
import { UpdateUnkownWordDto } from './dto/update-unkown-word.dto';

@Controller('unkown-words')
export class UnkownWordsController {
  constructor(private readonly unkownWordsService: UnkownWordsService) {}

  @Post()
  create(@Body() createUnkownWordDto: CreateUnkownWordDto) {
    return this.unkownWordsService.create(createUnkownWordDto);
  }

  @Get()
  findAll() {
    return this.unkownWordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unkownWordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnkownWordDto: UpdateUnkownWordDto) {
    return this.unkownWordsService.update(+id, updateUnkownWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unkownWordsService.remove(+id);
  }
}

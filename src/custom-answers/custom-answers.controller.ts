import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomAnswersService } from './custom-answers.service';
import { CreateCustomAnswerDto } from './dto/create-custom-answer.dto';
import { UpdateCustomAnswerDto } from './dto/update-custom-answer.dto';

@Controller('custom-answers')
export class CustomAnswersController {
  constructor(private readonly customAnswersService: CustomAnswersService) {}

  @Post()
  create(@Body() createCustomAnswerDto: CreateCustomAnswerDto) {
    return this.customAnswersService.create(createCustomAnswerDto);
  }

  @Get()
  findAll() {
    return this.customAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomAnswerDto: UpdateCustomAnswerDto) {
    return this.customAnswersService.update(+id, updateCustomAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customAnswersService.remove(+id);
  }
}

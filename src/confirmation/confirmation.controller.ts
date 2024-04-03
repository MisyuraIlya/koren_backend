import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { CreateConfirmationDto } from './dto/create-confirmation.dto';
import { UpdateConfirmationDto } from './dto/update-confirmation.dto';

@Controller('confirmation')
export class ConfirmationController {
  constructor(private readonly confirmationService: ConfirmationService) {}

  @Post()
  create(@Body() createConfirmationDto: CreateConfirmationDto) {
    return this.confirmationService.create(createConfirmationDto);
  }

  @Get()
  findAll() {
    return this.confirmationService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.confirmationService.findOne(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfirmationDto: UpdateConfirmationDto) {
    return this.confirmationService.update(+id, updateConfirmationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.confirmationService.remove(+id);
  }
}

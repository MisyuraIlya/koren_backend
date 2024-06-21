import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(':id')
  create(@Param('id') id: string,@Body() createMailDto: CreateMailDto) {
    return this.mailService.create(createMailDto,+id);
  }

  @Get('/user/:id')
  findAll() {
    return this.mailService.findAll();
  }

  @Get('/feedBack/:userId/:exerciseId')
  getFeedBack(@Param('userId') userId: string,@Param('exerciseId') exerciseId: string){
    return this.mailService.getFeedBack(+userId,+exerciseId)
  }

  @Get('undreaded/:id')
  getUnreaded(@Param('id') id: string){
    return this.mailService.getUnreaded(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('page') page: number = 1, @Query('search') search: string = '') {
    return this.mailService.findOne(+id, page, search);
  }

  @Patch(':uuid/:userId')
  update(@Param('uuid') uuid: string, @Param('userId') userId: string) {
    return this.mailService.update(uuid, +userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailService.remove(+id);
  }
}

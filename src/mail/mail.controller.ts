import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { TeacherRoleGuard } from 'src/auth/guard/teacher-gard';
import { StudentRoleGuard } from 'src/auth/guard/student-gard';
import { IdCheckerGuard } from 'src/auth/guard/id-cheker-gard';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(':id')
  create(@Param('id') id: string,@Body() createMailDto: CreateMailDto) {
    return this.mailService.create(createMailDto,id);
  }

  @Get('/user/:id')
  findAll() {
    return this.mailService.findAll();
  }

  @Get('/feedBack/:userId/:exerciseId')
  getFeedBack(@Param('userId') userId: string,@Param('exerciseId') exerciseId: string){
    return this.mailService.getFeedBack(+userId,+exerciseId)
  }

  @UseGuards(IdCheckerGuard)
  @Get('undreaded/:id')
  getUnreaded(@Param('id') id: string){
    return this.mailService.getUnreaded(+id)
  }

  @UseGuards(IdCheckerGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query('page') page: number = 1, @Query('search') search: string = '',  @Query('type') type: string = '') {
    return this.mailService.findOne(+id, page, search,type);
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

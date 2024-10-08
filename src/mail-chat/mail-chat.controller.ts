import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailChatService } from './mail-chat.service';
import { CreateMailChatDto } from './dto/create-mail-chat.dto';
import { UpdateMailChatDto } from './dto/update-mail-chat.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('mail-chat')
export class MailChatController {
  constructor(
    private readonly mailChatService: MailChatService
  ) {}

  @Post(':senderId/:mailUuid')
  create(
    @Param('senderId') uuid: string,
    @Param('mailUuid') mailUuid: string,
    @Body() createMailChatDto: CreateMailChatDto
  ) {
    return this.mailChatService.create(createMailChatDto,uuid,mailUuid);
  }

  @SkipThrottle()
  @Get()
  findAll() {
    return this.mailChatService.findAll();
  }

  @SkipThrottle()
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id',id)
    return this.mailChatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailChatDto: UpdateMailChatDto) {
    return this.mailChatService.update(+id, updateMailChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailChatService.remove(+id);
  }
}

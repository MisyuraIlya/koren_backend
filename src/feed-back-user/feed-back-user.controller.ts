import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedBackUserService } from './feed-back-user.service';
import { CreateFeedBackUserDto } from './dto/create-feed-back-user.dto';
import { UpdateFeedBackUserDto } from './dto/update-feed-back-user.dto';

@Controller('feed-back-user')
export class FeedBackUserController {
  constructor(private readonly feedBackUserService: FeedBackUserService) {}

  @Post()
  create(@Body() createFeedBackUserDto: CreateFeedBackUserDto) {
    return this.feedBackUserService.create(createFeedBackUserDto);
  }

  @Get()
  findAll() {
    return this.feedBackUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedBackUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedBackUserDto: UpdateFeedBackUserDto) {
    return this.feedBackUserService.update(+id, updateFeedBackUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedBackUserService.remove(+id);
  }
}

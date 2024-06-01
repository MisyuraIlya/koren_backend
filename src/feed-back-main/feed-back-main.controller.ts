import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedBackMainService } from './feed-back-main.service';
import { CreateFeedBackMainDto } from './dto/create-feed-back-main.dto';
import { UpdateFeedBackMainDto } from './dto/update-feed-back-main.dto';

@Controller('feed-back-main')
export class FeedBackMainController {
  constructor(private readonly feedBackMainService: FeedBackMainService) {}

  @Post()
  create(@Body() createFeedBackMainDto: CreateFeedBackMainDto) {
    return this.feedBackMainService.create(createFeedBackMainDto);
  }

  @Get()
  findAll() {
    return this.feedBackMainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedBackMainService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedBackMainDto: UpdateFeedBackMainDto) {
    return this.feedBackMainService.update(+id, updateFeedBackMainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedBackMainService.remove(+id);
  }
}

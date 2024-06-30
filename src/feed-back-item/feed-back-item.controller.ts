import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedBackItemService } from './feed-back-item.service';
import { CreateFeedBackItemDto } from './dto/create-feed-back-item.dto';
import { UpdateFeedBackItemDto } from './dto/update-feed-back-item.dto';

@Controller('feed-back-item')
export class FeedBackItemController {
  constructor(private readonly feedBackItemService: FeedBackItemService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createFeedBackItemDto: CreateFeedBackItemDto) {
    return this.feedBackItemService.create(+id, createFeedBackItemDto);
  }

  @Get()
  findAll() {
    return this.feedBackItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedBackItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedBackItemDto: UpdateFeedBackItemDto) {
    return this.feedBackItemService.update(+id, updateFeedBackItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedBackItemService.remove(+id);
  }
}

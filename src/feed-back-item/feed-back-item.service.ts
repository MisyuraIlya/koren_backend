import { Injectable } from '@nestjs/common';
import { CreateFeedBackItemDto } from './dto/create-feed-back-item.dto';
import { UpdateFeedBackItemDto } from './dto/update-feed-back-item.dto';

@Injectable()
export class FeedBackItemService {
  create(createFeedBackItemDto: CreateFeedBackItemDto) {
    return 'This action adds a new feedBackItem';
  }

  findAll() {
    return `This action returns all feedBackItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedBackItem`;
  }

  update(id: number, updateFeedBackItemDto: UpdateFeedBackItemDto) {
    return `This action updates a #${id} feedBackItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedBackItem`;
  }
}

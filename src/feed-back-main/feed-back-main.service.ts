import { Injectable } from '@nestjs/common';
import { CreateFeedBackMainDto } from './dto/create-feed-back-main.dto';
import { UpdateFeedBackMainDto } from './dto/update-feed-back-main.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedBackMain } from './entities/feed-back-main.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedBackMainService {
  constructor(
    @InjectRepository(FeedBackMain)
    private readonly feedBackMainRepository: Repository<FeedBackMain>,

){}
  create(createFeedBackMainDto: CreateFeedBackMainDto) {
    return 'This action adds a new feedBackMain';
  }

  findAll() {
    return this.feedBackMainRepository.find({
      relations:['items']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedBackMain`;
  }

  update(id: number, updateFeedBackMainDto: UpdateFeedBackMainDto) {
    return `This action updates a #${id} feedBackMain`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedBackMain`;
  }
}

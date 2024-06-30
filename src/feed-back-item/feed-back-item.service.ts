import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedBackItemDto } from './dto/create-feed-back-item.dto';
import { UpdateFeedBackItemDto } from './dto/update-feed-back-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedBackMain } from 'src/feed-back-main/entities/feed-back-main.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { FeedBackItem } from './entities/feed-back-item.entity';

@Injectable()
export class FeedBackItemService {
  constructor(
    @InjectRepository(FeedBackMain)
    private readonly feedBackMainRepository: Repository<FeedBackMain>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(FeedBackItem)
    private readonly feedBackItemRepository: Repository<FeedBackItem>,

  ){}

  async create(userId: number, dto: CreateFeedBackItemDto) {
    const findUser = await this.authRepository.findOne({
      where:{id:userId}
    })

    if(!findUser) throw new BadRequestException('not user found')

    const findMain = await this.feedBackMainRepository.findOne({
      where:{title: dto.type === 'positive' ? 'משובים שלי (חיובי)' : 'משובים שלי (שלילי)'}
    })

    if(findMain){
      const newItem = new FeedBackItem()
      newItem.title = dto.title 
      newItem.user = findUser 
      newItem.main = findMain
      this.feedBackItemRepository.save(newItem)
      return newItem
    }
    
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

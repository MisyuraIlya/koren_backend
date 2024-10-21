import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedBackMainDto } from './dto/create-feed-back-main.dto';
import { UpdateFeedBackMainDto } from './dto/update-feed-back-main.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedBackMain } from './entities/feed-back-main.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Injectable()
export class FeedBackMainService {
  constructor(
    @InjectRepository(FeedBackMain)
    private readonly feedBackMainRepository: Repository<FeedBackMain>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,

){}
  create(createFeedBackMainDto: CreateFeedBackMainDto) {
    return 'This action adds a new feedBackMain';
  }

  findAll() {
    return this.feedBackMainRepository.find({
      relations:['items']
    });
  }

  async findOne(id: number) {
    const findUser = await this.authRepository.findOne({
      where:{id:id}
    })

    if(!findUser) throw new BadRequestException('not user found')

      const feedBackMain = await this.feedBackMainRepository.createQueryBuilder('main')
      .leftJoinAndSelect('main.items', 'item')
      .where('item.userId IS NULL OR item.userId = :userId', { userId: findUser?.id })
      .getMany();

    return feedBackMain;
  }

  update(id: number, updateFeedBackMainDto: UpdateFeedBackMainDto) {
    return `This action updates a #${id} feedBackMain`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedBackMain`;
  }
}

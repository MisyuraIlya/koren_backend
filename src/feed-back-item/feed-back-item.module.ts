import { Module } from '@nestjs/common';
import { FeedBackItemService } from './feed-back-item.service';
import { FeedBackItemController } from './feed-back-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackItem } from './entities/feed-back-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackItem])],
  controllers: [FeedBackItemController],
  providers: [FeedBackItemService],
})
export class FeedBackItemModule {}

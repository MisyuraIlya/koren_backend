import { Module } from '@nestjs/common';
import { FeedBackItemService } from './feed-back-item.service';
import { FeedBackItemController } from './feed-back-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackItem } from './entities/feed-back-item.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { FeedBackMain } from 'src/feed-back-main/entities/feed-back-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackItem,AuthEntity,FeedBackMain])],
  controllers: [FeedBackItemController],
  providers: [FeedBackItemService],
})
export class FeedBackItemModule {}

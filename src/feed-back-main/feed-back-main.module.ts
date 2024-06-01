import { Module } from '@nestjs/common';
import { FeedBackMainService } from './feed-back-main.service';
import { FeedBackMainController } from './feed-back-main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackMain } from './entities/feed-back-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackMain])],
  controllers: [FeedBackMainController],
  providers: [FeedBackMainService],
})
export class FeedBackMainModule {}

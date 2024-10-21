import { Module } from '@nestjs/common';
import { FeedBackMainService } from './feed-back-main.service';
import { FeedBackMainController } from './feed-back-main.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackMain } from './entities/feed-back-main.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackMain, AuthEntity])],
  controllers: [FeedBackMainController],
  providers: [FeedBackMainService],
})
export class FeedBackMainModule {}

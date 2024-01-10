import { Module } from '@nestjs/common';
import { TabService } from './tab.service';
import { TabController } from './tab.controller';
import { TabEntity } from './entities/tab.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TabEntity])],
  controllers: [TabController],
  providers: [TabService],
})
export class TabModule {}

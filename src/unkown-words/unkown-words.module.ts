import { Module } from '@nestjs/common';
import { UnkownWordsService } from './unkown-words.service';
import { UnkownWordsController } from './unkown-words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnkownWord } from './entities/unkown-word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnkownWord])],
  controllers: [UnkownWordsController],
  providers: [UnkownWordsService],
})
export class UnkownWordsModule {}

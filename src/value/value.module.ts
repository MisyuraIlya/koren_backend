import { Module } from '@nestjs/common';
import { ValueService } from './value.service';
import { ValueController } from './value.controller';
import { ValueEntity } from './entities/value.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ValueEntity])],
  controllers: [ValueController],
  providers: [ValueService],
})
export class ValueModule {}

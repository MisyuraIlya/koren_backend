import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { ObjectiveEntity } from './entities/objective.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValueEntity } from 'src/value/entities/value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectiveEntity,ValueEntity])],
  controllers: [ObjectiveController],
  providers: [ObjectiveService],
})
export class ObjectiveModule {}

import { Module } from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { HighlightController } from './highlight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HighlightEntity } from './entities/highlight.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HighlightEntity, ObjectiveEntity, AuthEntity])],
  controllers: [HighlightController],
  providers: [HighlightService],
})
export class HighlightModule {}

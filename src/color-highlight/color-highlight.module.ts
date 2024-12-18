import { Module } from '@nestjs/common';
import { ColorHighlightService } from './color-highlight.service';
import { ColorHighlightController } from './color-highlight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorHighlight } from './entities/color-highlight.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColorHighlight, ExerciseEntity, AuthEntity])],
  controllers: [ColorHighlightController],
  providers: [ColorHighlightService],
})
export class ColorHighlightModule {}

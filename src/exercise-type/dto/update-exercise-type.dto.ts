import { PartialType } from '@nestjs/swagger';
import { CreateExerciseTypeDto } from './create-exercise-type.dto';

export class UpdateExerciseTypeDto extends PartialType(CreateExerciseTypeDto) {}

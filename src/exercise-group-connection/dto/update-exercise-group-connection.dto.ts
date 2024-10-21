import { PartialType } from '@nestjs/swagger';
import { CreateExerciseGroupConnectionDto } from './create-exercise-group-connection.dto';

export class UpdateExerciseGroupConnectionDto extends PartialType(CreateExerciseGroupConnectionDto) {}

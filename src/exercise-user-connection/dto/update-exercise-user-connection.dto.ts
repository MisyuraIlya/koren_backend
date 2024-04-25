import { PartialType } from '@nestjs/swagger';
import { CreateExerciseUserConnectionDto } from './create-exercise-user-connection.dto';

export class UpdateExerciseUserConnectionDto extends PartialType(CreateExerciseUserConnectionDto) {}

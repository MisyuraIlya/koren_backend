import { PartialType } from '@nestjs/swagger';
import { CreateCustomAnswerDto } from './create-custom-answer.dto';

export class UpdateCustomAnswerDto extends PartialType(CreateCustomAnswerDto) {}

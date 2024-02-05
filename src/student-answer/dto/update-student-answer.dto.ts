import { PartialType } from '@nestjs/swagger';
import { CreateStudentAnswerDto } from './create-student-answer.dto';

export class UpdateStudentAnswerDto extends PartialType(CreateStudentAnswerDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateStudentHistoryDto } from './create-student-history.dto';

export class UpdateStudentHistoryDto extends PartialType(CreateStudentHistoryDto) {}

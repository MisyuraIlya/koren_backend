import { IsNumber, IsOptional, IsString, ValidateNested, isNumber } from 'class-validator';

export class CreateStudentAnswerDto {

    @IsString()
    @IsOptional()
    value: string | null;
  
}

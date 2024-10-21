import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, isNumber } from 'class-validator';

export class CreateStudentAnswerDto {

    @IsString()
    @IsOptional()
    value: string | null;

    @IsBoolean()
    @IsOptional()
    isCorrect: boolean;
  
    @IsString()
    @IsOptional()
    moduleType: string

}

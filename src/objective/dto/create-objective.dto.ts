import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAnswerDto } from 'src/answer/dto/create-answer.dto';
import { CreateValueDto } from 'src/value/dto/create-value.dto';

export class CreateObjectiveDto {
  
    @IsNumber()
    @IsOptional()
    orden: number | null;

    @IsString()
    @IsOptional()
    placeholder: string | null;

    @IsString()
    moduleType: string;

    @IsBoolean()
    @IsOptional()
    isFullText: boolean;

    @ValidateNested()
    @Type(() => CreateAnswerDto)
    answers: CreateAnswerDto[];

    @ValidateNested()
    @Type(() => CreateValueDto)
    values: CreateValueDto[];
  
}
  
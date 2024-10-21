import { IsOptional, IsString } from 'class-validator';

export class CreateAnswerDto {
    @IsString()
    @IsOptional()
    value: string | null;
}
  
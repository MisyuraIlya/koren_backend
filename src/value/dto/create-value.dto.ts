import { IsOptional, IsString } from 'class-validator';

export class CreateValueDto {
    @IsString()
    @IsOptional()
    value: string | null;
}
  
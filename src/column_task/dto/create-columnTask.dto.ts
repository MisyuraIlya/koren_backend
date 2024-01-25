import { IsNumber, IsOptional, IsString, isArray } from 'class-validator';

export class CreateColumnTaskDto {
  
    @IsNumber()
    @IsOptional()
    orden: number | null;

    @IsString()
    @IsOptional()
    title: string | null;

    @IsString()
    type: string;
  
}
  
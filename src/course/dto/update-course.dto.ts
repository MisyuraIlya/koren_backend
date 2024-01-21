import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseDto {

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsNumber()
  orden?: number;

  @IsOptional()
  @IsNotEmpty()
  pdf?: string;
}

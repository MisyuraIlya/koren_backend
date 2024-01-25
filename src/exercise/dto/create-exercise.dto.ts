import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateTabDto } from 'src/tab/dto/create-tab.dto';

export class CreateExerciseDto {
  
    @IsString()
    @IsOptional()
    title: string | null;
  
    @IsString()
    @IsOptional()
    description1: string | null;
  
    @IsString()
    @IsOptional()
    description2: string | null;
  
    @IsNumber()
    @IsOptional()
    module: number | null;
  
    @IsString()
    @IsOptional()
    youtube_link: string | null;
  
    @IsString()
    @IsOptional()
    pdf: string | null;
  
    @IsNumber()
    courseId: number;

    @ValidateNested()
    @Type(() => CreateTabDto)
    tabs: CreateTabDto[];
  }
  
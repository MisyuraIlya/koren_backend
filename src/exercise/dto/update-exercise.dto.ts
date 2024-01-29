import { IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  
    @IsString()
    @IsOptional()
    youtubeLink: string | null;
  
    @IsString()
    @IsOptional()
    pdf: string | null;
  
  }
  
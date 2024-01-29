import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateTabDto } from 'src/tab/dto/create-tab.dto';

export class UpdateExerciseDto {
  
    @IsString()
    @IsOptional()
    youtubeLink: string | null;
  
    @IsString()
    @IsOptional()
    pdf: string | null;
  
  }
  
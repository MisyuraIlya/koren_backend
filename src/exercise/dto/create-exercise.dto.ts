import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
    id: number;
  
    @IsString()
    title: string;
  
    @IsString()
    description: string;
  
    @IsString()
    description2: string;
  
  
    @IsNumber()
    module: number;
  
    youtube_link: string | null;
  
    pdf: string | null;
  
    xl: string;
  
    @IsNumber()
    courseId: number;
    // collectionsCols: ExerciseColDTO[];
    // collectionsRows: ExerciseRowDTO[];
  }
  
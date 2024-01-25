import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateObjectiveDto } from 'src/objective/dto/create-objective.dto';

export class CreateRowTaskDto {
  
    @IsNumber()
    @IsOptional()
    orden: number | null;

    @IsString()
    @IsOptional()
    youtubeLink: string | null;

    @IsString()
    @IsOptional()
    pdf: string | null;

    @ValidateNested()
    @Type(() => CreateObjectiveDto)
    objectives: CreateObjectiveDto[];
  
}
  
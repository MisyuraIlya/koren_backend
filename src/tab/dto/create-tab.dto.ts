import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';

export class CreateTabDto {
  
    @IsString()
    @IsOptional()
    title: string | null;
  
    @IsNumber()
    @IsOptional()
    orden: number | null;
  
    @ValidateNested()
    @Type(() => CreateTaskDto)
    tasks: CreateTaskDto[];
  
}
  
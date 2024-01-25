import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateColumnTaskDto } from 'src/column_task/dto/create-columnTask.dto';
import { CreateRowTaskDto } from 'src/row_task/dto/create-rowTask.dto';

export class CreateTaskDto {
  
    @IsNumber()
    @IsOptional()
    orden: number | null;

    @IsString()
    specialModuleType: string;

    @IsString()
    @IsOptional()
    properties: string;

    @ValidateNested()
    @Type(() => CreateColumnTaskDto)
    columns: CreateColumnTaskDto[];

    @ValidateNested()
    @Type(() => CreateRowTaskDto)
    rows: CreateRowTaskDto[];
  
}
  
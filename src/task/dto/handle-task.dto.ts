import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateColumnTaskDto } from 'src/column_task/dto/create-columnTask.dto';
import { CreateRowTaskDto } from 'src/row_task/dto/create-rowTask.dto';
import { TaskEntity } from '../entities/task.entity';

export class HandleTaskDto {
  
    task: TaskEntity;
    orden: number
  
}
  
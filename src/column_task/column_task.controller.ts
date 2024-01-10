import { Controller } from '@nestjs/common';
import { ColumnTaskService } from './column_task.service';

@Controller('column-task')
export class ColumnTaskController {
  constructor(private readonly columnTaskService: ColumnTaskService) {}
}

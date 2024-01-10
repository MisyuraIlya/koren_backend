import { Controller } from '@nestjs/common';
import { RowTaskService } from './row_task.service';

@Controller('row-task')
export class RowTaskController {
  constructor(private readonly rowTaskService: RowTaskService) {}
}

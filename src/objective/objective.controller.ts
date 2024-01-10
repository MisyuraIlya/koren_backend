import { Controller } from '@nestjs/common';
import { ObjectiveService } from './objective.service';

@Controller('objective')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}
}

import { Body, Controller, Param, Post } from '@nestjs/common';
import { ObjectiveService } from './objective.service';

@Controller('objective')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Post(':id')
  Media(@Param('id') id: number, @Body() dto: {media:string}) {
    return this.objectiveService.MediaCreate(+id, dto);
  }
}

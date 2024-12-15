import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  @Post(':userId/:objectiveId')
  create(
    @Param('userId') userId: number,
    @Param('objectiveId') objectiveId: number,
    @Body() createHighlightDto: CreateHighlightDto
  ) {
    return this.highlightService.create(userId,objectiveId,createHighlightDto);
  }


}

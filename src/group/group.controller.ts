import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post(':teacherId')
  create(@Param('teacherId') teacherId: string, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(+teacherId,createGroupDto,true);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get('/teacher/:teacherId')
  findGroupsByTeacher(@Param('teacherId') id: string) {
    return this.groupService.findGroupsByTeacher(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}

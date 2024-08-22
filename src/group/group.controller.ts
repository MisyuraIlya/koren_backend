import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { TeacherRoleGuard } from 'src/auth/guard/teacher-gard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(TeacherRoleGuard)
  @Post(':teacherId')
  create(@Param('teacherId') teacherId: string, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(+teacherId,createGroupDto,true);
  }

  @SkipThrottle()
  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @UseGuards(TeacherRoleGuard)
  @SkipThrottle()
  @Get('/groupStatistic/:groupId/:exerciseId')
  getStatistic(@Param('groupId') groupId: string,@Param('exerciseId') exerciseId: string) {
    return this.groupService.getGroupStatistic(groupId,+exerciseId)
  }

  @SkipThrottle()
  @UseGuards(TeacherRoleGuard)
  @Get('/teacher/:teacherId')
  findGroupsByTeacher(@Param('teacherId') id: string) {
    return this.groupService.findGroupsByTeacher(+id);
  }

  @UseGuards(TeacherRoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @UseGuards(TeacherRoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}

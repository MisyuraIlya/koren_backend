import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShieldService } from './shield.service';
import { CreateShieldDto } from './dto/create-shield.dto';
import { UpdateShieldDto } from './dto/update-shield.dto';
import { TeacherRoleGuard } from 'src/auth/guard/teacher-gard';

@Controller('shield')
export class ShieldController {
  constructor(private readonly shieldService: ShieldService) {}

  @UseGuards(TeacherRoleGuard)
  @Post()
  create(@Body() createShieldDto: CreateShieldDto) {
    return this.shieldService.create(createShieldDto);
  }

  @UseGuards(TeacherRoleGuard)
  @Get()
  findAll() {
    return this.shieldService.findAll();
  }

  @UseGuards(TeacherRoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shieldService.findOne(+id);
  }

  @UseGuards(TeacherRoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShieldDto: UpdateShieldDto) {
    return this.shieldService.update(+id, updateShieldDto);
  }

  @UseGuards(TeacherRoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shieldService.remove(+id);
  }
}

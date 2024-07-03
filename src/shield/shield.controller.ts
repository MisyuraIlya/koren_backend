import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShieldService } from './shield.service';
import { CreateShieldDto } from './dto/create-shield.dto';
import { UpdateShieldDto } from './dto/update-shield.dto';

@Controller('shield')
export class ShieldController {
  constructor(private readonly shieldService: ShieldService) {}

  @Post()
  create(@Body() createShieldDto: CreateShieldDto) {
    return this.shieldService.create(createShieldDto);
  }

  @Get()
  findAll() {
    return this.shieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShieldDto: UpdateShieldDto) {
    return this.shieldService.update(+id, updateShieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shieldService.remove(+id);
  }
}

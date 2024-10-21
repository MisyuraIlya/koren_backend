import { PartialType } from '@nestjs/swagger';
import { CreateShieldDto } from './create-shield.dto';

export class UpdateShieldDto extends PartialType(CreateShieldDto) {}

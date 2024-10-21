import { Controller } from '@nestjs/common';
import { ValueService } from './value.service';

@Controller('value')
export class ValueController {
  constructor(private readonly valueService: ValueService) {}
}

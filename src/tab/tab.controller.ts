import { Controller } from '@nestjs/common';
import { TabService } from './tab.service';

@Controller('tab')
export class TabController {
  constructor(private readonly tabService: TabService) {}
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';
@Controller()
export class AppController {
  constructor(private readonly cronService: CronService) {}

  @Get('/fetchCourses')
  manualExecution() {
    this.cronService.fetchCourses();
    return 'Manual execution initiated';
  }

  @Get('/fetchExercises')
  async fetchExercises() {
    await this.cronService.fetchExercises();
    return 'fetch exercises start';
  }
}

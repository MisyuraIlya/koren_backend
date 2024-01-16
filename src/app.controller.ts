import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';
import Engine from './engine/module';
import { Multer,diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly cronService: CronService) {}

  @Get('/fetchCourses')
  manualExecution() {
    this.cronService.fetchCourses();
    return 'Manual execution initiated';
  }

  @Get('/fetchExercises')
  fetchExercises() {
    this.cronService.fetchExercises();
    return 'fetch exercises start';
  }

  @Post('/engine')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          console.log('uniqueSuffix',uniqueSuffix)
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  ParseXl(@UploadedFile() file: Express.Multer.File) {
    return new Engine(file).process();
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  saveMedia(file: Express.Multer.File): {path: string} {
    console.log('here')
    const obj = {
      path: file.path,
    }
    return obj
  }
}

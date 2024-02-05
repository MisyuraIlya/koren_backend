import { Module } from '@nestjs/common';
import { StudentHistoryService } from './student-history.service';
import { StudentHistoryController } from './student-history.controller';

@Module({
  controllers: [StudentHistoryController],
  providers: [StudentHistoryService],
})
export class StudentHistoryModule {}

import { Module } from '@nestjs/common';
import { StudentHistoryService } from './student-history.service';
import { StudentHistoryController } from './student-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentHistory } from './entities/student-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentHistory])],
  controllers: [StudentHistoryController],
  providers: [StudentHistoryService],
})
export class StudentHistoryModule {}

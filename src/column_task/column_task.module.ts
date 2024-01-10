import { Module } from '@nestjs/common';
import { ColumnTaskService } from './column_task.service';
import { ColumnTaskController } from './column_task.controller';
import { ColumnTaskEntity } from './entities/columnTask.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnTaskEntity])],
  controllers: [ColumnTaskController],
  providers: [ColumnTaskService],
})
export class ColumnTaskModule {}

import { Module } from '@nestjs/common';
import { RowTaskService } from './row_task.service';
import { RowTaskController } from './row_task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RowTaskEntity } from './entities/rowTask.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RowTaskEntity])],
  controllers: [RowTaskController],
  providers: [RowTaskService],
})
export class RowTaskModule {}

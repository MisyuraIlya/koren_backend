import { Module } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Semester])],
  controllers: [SemesterController],
  providers: [SemesterService],
})
export class SemesterModule {}

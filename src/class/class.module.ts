import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { School } from 'src/school/entities/school.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class,School])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}

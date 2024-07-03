import { Module } from '@nestjs/common';
import { ShieldService } from './shield.service';
import { ShieldController } from './shield.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { Shield } from './entities/shield.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity,AuthEntity,Shield])],
  controllers: [ShieldController],
  providers: [ShieldService],
})
export class ShieldModule {}

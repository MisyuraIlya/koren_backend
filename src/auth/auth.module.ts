import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { School } from 'src/school/entities/school.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity,School])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

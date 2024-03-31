import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { School } from 'src/school/entities/school.entity';
import { Class } from 'src/class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group,AuthEntity,School,Class])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}

import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { School } from 'src/school/entities/school.entity';
import { Class } from 'src/class/entities/class.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { CourseEntity } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group,AuthEntity,School,Class,ExerciseGroupConnection,StudentHistory,ExerciseEntity,CourseEntity])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}

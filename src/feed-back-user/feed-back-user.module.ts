import { Module } from '@nestjs/common';
import { FeedBackUserService } from './feed-back-user.service';
import { FeedBackUserController } from './feed-back-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackUser } from './entities/feed-back-user.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackUser,AuthEntity,ExerciseUserConnection,ExerciseGroupConnection])],
  controllers: [FeedBackUserController],
  providers: [FeedBackUserService],
})
export class FeedBackUserModule {}

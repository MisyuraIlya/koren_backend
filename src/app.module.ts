import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { ExerciseModule } from './exercise/exercise.module';
import { TabModule } from './tab/tab.module';
import { TaskModule } from './task/task.module';
import { ColumnTaskModule } from './column_task/column_task.module';
import { RowTaskModule } from './row_task/row_task.module';
import { ObjectiveModule } from './objective/objective.module';
import { AnswerModule } from './answer/answer.module';
import { ValueModule } from './value/value.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { CourseEntity } from './course/entities/course.entity';
import { ExerciseEntity } from './exercise/entities/exercise.entity';
import { TabEntity } from './tab/entities/tab.entity';
import { TaskEntity } from './task/entities/task.entity';
import { ColumnTaskEntity } from './column_task/entities/columnTask.entity';
import { RowTaskEntity } from './row_task/entities/rowTask.entity';
import { ObjectiveEntity } from './objective/entities/objective.entity';
import { AnswerEntity } from './answer/entities/answer.entity';
import { ValueEntity } from './value/entities/value.entity';
import { AuthModule } from './auth/auth.module';
import { PdfUtilitiesModule } from './pdf-utilities/pdf-utilities.module';
import { StudentHistoryModule } from './student-history/student-history.module';
import { StudentAnswerModule } from './student-answer/student-answer.module';
import { GradeModule } from './grade/grade.module';
import { SchoolModule } from './school/school.module';
import { GroupModule } from './group/group.module';
import { ClassModule } from './class/class.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath:[`stage.${process.env.STAGE}.env`],
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type:'postgres',
          host:configService.get('DB_HOST'),
          port:configService.get('DB_PORT'),
          username:configService.get('DB_USERNAME'),
          password:configService.get('DB_PASSWORD'),
          database:configService.get('DB_DATABASE'),
          autoLoadEntities:true,
          synchronize:true
        }
      }
    }),
    TypeOrmModule.forFeature([CourseEntity,ExerciseEntity,TabEntity,TaskEntity,ColumnTaskEntity, RowTaskEntity,ObjectiveEntity,AnswerEntity, ValueEntity]),
    CourseModule, 
    ExerciseModule, 
    TabModule, 
    TaskModule, 
    ColumnTaskModule, 
    RowTaskModule, 
    ObjectiveModule, 
    AnswerModule, 
    ValueModule, 
    AuthModule, 
    PdfUtilitiesModule, 
    StudentHistoryModule, 
    StudentAnswerModule, 
    GradeModule, 
    SchoolModule, 
    GroupModule, 
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService,CronService],
})
export class AppModule {}

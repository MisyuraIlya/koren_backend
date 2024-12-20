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
import { ConfirmationModule } from './confirmation/confirmation.module';
import { SemesterModule } from './semester/semester.module';
import { ExerciseTypeModule } from './exercise-type/exercise-type.module';
import { ExerciseGroupConnectionModule } from './exercise-group-connection/exercise-group-connection.module';
import { ExerciseUserConnectionModule } from './exercise-user-connection/exercise-user-connection.module';
import { FeedBackMainModule } from './feed-back-main/feed-back-main.module';
import { FeedBackItemModule } from './feed-back-item/feed-back-item.module';
import { MailModule } from './mail/mail.module';
import { MailChatModule } from './mail-chat/mail-chat.module';
import { PdfUtilitiesEntity } from './pdf-utilities/entities/pdf-utility.entity';
import { AuthEntity } from './auth/entities/auth.entity';
import { ExerciseType } from './exercise-type/entities/exercise-type.entity';
import { FeedBackMain } from './feed-back-main/entities/feed-back-main.entity';
import { Semester } from './semester/entities/semester.entity';
import { ShieldModule } from './shield/shield.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomAnswersModule } from './custom-answers/custom-answers.module';
import { HighlightModule } from './highlight/highlight.module';
import { UnkownWordsModule } from './unkown-words/unkown-words.module';
import { ColorHighlightModule } from './color-highlight/color-highlight.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:[`stage.${process.env.STAGE}.env`],
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('DB_HOST',configService.get('DB_HOST'))
        console.log('DB_PORT',configService.get('DB_PORT'))
        console.log('DB_USERNAME',configService.get('DB_USERNAME'))
        console.log('DB_PASSWORD',configService.get('DB_PASSWORD'))
        console.log('DB_DATABASE',configService.get('DB_DATABASE'))
        return {
          type:'postgres',
          host:configService.get('DB_HOST'),
          port:configService.get('DB_PORT'),
          username:configService.get('DB_USERNAME'),
          password:configService.get('DB_PASSWORD'),
          autoLoadEntities:true,
          synchronize:true,
          // ssl: {
          //   rejectUnauthorized: false,  // This allows self-signed certificates
          // },
        }
      }
    }),
    MailerModule.forRoot({
      transport: 'smtps://statosbiz@statos.co:2014ismyyear@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <statosbiz@statos.co>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    TypeOrmModule.forFeature([Semester, FeedBackMain ,AuthEntity, ExerciseType, FeedBackMain ,CourseEntity,ExerciseEntity,TabEntity,TaskEntity,ColumnTaskEntity, RowTaskEntity,ObjectiveEntity,AnswerEntity, ValueEntity,PdfUtilitiesEntity]),
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
    ConfirmationModule, 
    SemesterModule, 
    ExerciseTypeModule, 
    ExerciseGroupConnectionModule, 
    ExerciseUserConnectionModule, 
    FeedBackMainModule, 
    FeedBackItemModule, 
    MailModule, 
    MailChatModule, 
    ShieldModule, 
    CustomAnswersModule, 
    HighlightModule,
    UnkownWordsModule,
    ColorHighlightModule
  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CronService
  ],
})
export class AppModule {}

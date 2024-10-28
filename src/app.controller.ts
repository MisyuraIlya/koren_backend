import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, ParseFilePipe, MaxFileSizeValidator, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';
import Engine from './engine/module';
import { Multer,diskStorage } from 'multer';
import { extname } from 'path';
import { fileStorage } from './storage';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { ExerciseType } from './exercise-type/entities/exercise-type.entity';
import { FeedBackMain } from './feed-back-main/entities/feed-back-main.entity';
import { Role } from './enums/role.enum';
import { Semester } from './semester/entities/semester.entity';
import { TypeFeedBack } from './enums/feedback.enum';
import { AdminRoleGuard } from './auth/guard/admin-role.gard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(
    private readonly cronService: CronService,
    private readonly appService: AppService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(ExerciseType)
    private readonly exerciseTypeRepository: Repository<ExerciseType>,
    @InjectRepository(FeedBackMain)
    private readonly feedBackMainRepository: Repository<FeedBackMain>,
    @InjectRepository(Semester)
    private readonly confirmationRepository: Repository<Semester>,
    ) {}

  @SkipThrottle()
  @Get('/fetchCourses')
  manualExecution() {
    this.cronService.fetchCourses();
    return 'Manual execution initiated';
  }

  @SkipThrottle()
  @Get('/fetchExercises')
  fetchExercises() {
    this.cronService.fetchExercises();
    return 'fetch exercises start';
  }

  @SkipThrottle()
  @Get('/handleSelectBoxOrden')
  selectBoxOrden() {
    this.cronService.handleSelectBox();
    return 'fetch exercises start';
  }

  @SkipThrottle()
  @Post('/engine')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  ParseXl(@UploadedFile() file: Express.Multer.File) {
    return new Engine(file).process();
  }

  @SkipThrottle()
  @UseGuards(AdminRoleGuard)
  @Post('media')
  @UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
  async mediaHandler(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), 
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    return this.appService.saveMedia(file);
  }

  @SkipThrottle()
  @Get('initial')
  async initial(){
    const admin = new AuthEntity;
    admin.email = 'admin@gmail.com'
    admin.password = '123456'
    admin.isActive = true;
    admin.role = Role.Admin,
    admin.firstName = 'קורן'
    admin.lastName = 'שרעבי'
    this.authRepository.save(admin)

    const teacher = new AuthEntity;
    teacher.email = 'teacher@gmail.com'
    teacher.password = '123456'
    teacher.firstName = 'קורן'
    teacher.lastName = 'שרעבי'
    teacher.role = Role.Teacher
    teacher.isActive = true
    this.authRepository.save(teacher)

    const exerciseType = [
      {title:'תרגיל', isDatable:false,isTimable:false, orden:1},
      {title:'מבדק', isDatable:true,isTimable:false, orden:2},
      {title:'מבחן', isDatable:true,isTimable:true, orden:3},
      {title:'תלקיט ארוך טווח', isDatable:true,isTimable:false, orden:4},
      {title:'תלקיט קצר טווח', isDatable:true,isTimable:false, orden:5},
    ]
    exerciseType?.map(async (item) => {
      const exercise = new ExerciseType();
      exercise.title = item.title;
      exercise.isDateable = item.isDatable
      exercise.isTimeable = item.isTimable
      exercise.orden = item.orden
      await this.exerciseTypeRepository.save(exercise)
    })

    const semeters = [
      {title:'1',yaer:'2023',fromDate:'2023-09-01',toDate:'2024-08-01',active:false},
      {title:'2',yaer:'2024',fromDate:'2024-09-01',toDate:'2025-08-01',active:true},
      {title:'3',yaer:'2025',fromDate:'2025-09-01',toDate:'2026-08-01',active:false},
      {title:'4',yaer:'2026',fromDate:'2026-09-01',toDate:'2027-08-01',active:false},
      {title:'5',yaer:'2027',fromDate:'2027-09-01',toDate:'2028-08-01',active:false},
    ]

    semeters?.map(async (item) => {
      const sem = new Semester()
      sem.title = item.title
      sem.year = +item.yaer
      sem.fromDate = new Date(item.fromDate)
      sem.toDate = new Date(item.toDate)
      sem.active = item.active
      await this.confirmationRepository.save(sem)
    })


    const bankFeedBack =[
      {title:'משובים שלי (חיובי)',type:TypeFeedBack.Positive},
      {title:'משובים שלי (שלילי)',type:TypeFeedBack.Negative}
    ]
    
    bankFeedBack?.map(async (item) => {
      const fed = new FeedBackMain()
      fed.title = item.title,
      fed.type = item.type
      await this.feedBackMainRepository.save(fed)
    })


  }



}

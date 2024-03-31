import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, ParseFilePipe, MaxFileSizeValidator, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';
import Engine from './engine/module';
import { Multer,diskStorage } from 'multer';
import { extname } from 'path';
import { fileStorage } from './storage';

@Controller()
export class AppController {
  constructor(
    private readonly cronService: CronService,
    private readonly appService: AppService
    ) {}

  @Get('/fetchCourses')
  manualExecution() {
    this.cronService.fetchCourses();
    return 'Manual execution initiated';
  }

  @Get('/fetchExercises')
  fetchExercises() {
    this.cronService.fetchExercises();
    return 'fetch exercises start';
  }

  @Post('/engine')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          console.log('uniqueSuffix',uniqueSuffix)
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  ParseXl(@UploadedFile() file: Express.Multer.File) {
    return new Engine(file).process();
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('file', {storage: fileStorage}))
  async mediaHandler(
    @UploadedFile(new ParseFilePipe({validators: [new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5})],})
    ) file: Express.Multer.File,
  ){
    return this.appService.saveMedia(file)
  }

  @Get('test')
  async test(){
    return {
      "@odata.context": "https://prt.shanishenhav.com/odata/Priority/tabula.ini/shni22/$metadata#AGENT_STATSV2",
      "value": [
          {
              "AGENTCODE": "94",
              "AGENTNAME": "אריק שטיין",
              "ORD_SALES": 48.97,
              "DOC_SALES": 12282.94,
              "PROJ_SALES": 0.00,
              "IV_SALES": 0.00,
              "ACC_SALES": 5659.00,
              "CHEQUE_SALES": 63064.00,
              "CODE": "ש'ח",
              "CREDIT": 17990.91,
              "MAX_SALES": 800000.00,
              "CREDIT_REST": 782009.09,
              "OBLIGO": 81054.91,
              "MAX_OBLIGO": 800000.00,
              "OBLIGO_REST": 718945.09,
              "MAX_CREDIT_ENV": 950000.00,
              "MAX_OBLIGO_ENV": 950000.00,
              "OBCODE": "ש'ח",
              "CURDATE": "2024-02-13T00:00:00+02:00",
              "ARG_MSGTYPE": null,
              "CUST": 22,
              "OBLIGO_FNCITEMS_SUBFORM": [
                  {
                      "BALDATE": "2024-01-11T00:00:00+02:00",
                      "FNCNUM": "24000538",
                      "IVNUM": "SI248000179",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. לקוח מרכזת",
                      "SUM1": 292.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-07-09T00:00:00+03:00",
                      "FNCIREF1": "SI248000179",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 292.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 760320,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-01-25T00:00:00+02:00",
                      "FNCNUM": "24001854",
                      "IVNUM": "SI248000832",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. מרכזת ינו-24",
                      "SUM1": 1.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-07-23T00:00:00+03:00",
                      "FNCIREF1": "SI248000832",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 1.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 762253,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-01-28T00:00:00+02:00",
                      "FNCNUM": "24002006",
                      "IVNUM": "SI248000928",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. מרכזת ינו-24",
                      "SUM1": 1.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-07-26T00:00:00+03:00",
                      "FNCIREF1": "SI248000928",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 1.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 762433,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-01-28T00:00:00+02:00",
                      "FNCNUM": "24002172",
                      "IVNUM": "SI248001017",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. לקוח מרכזת",
                      "SUM1": 1525.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-07-26T00:00:00+03:00",
                      "FNCIREF1": "SI248001017",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 1525.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 762610,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-01-31T00:00:00+02:00",
                      "FNCNUM": "24002973",
                      "IVNUM": "SI248001629",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. לקוח מרכזת",
                      "SUM1": 109.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-07-29T00:00:00+03:00",
                      "FNCIREF1": "SI248001629",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 109.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 763429,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-02-08T00:00:00+02:00",
                      "FNCNUM": "24003423",
                      "IVNUM": "SI248001755",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. לקוח מרכזת",
                      "SUM1": 2600.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-08-06T00:00:00+03:00",
                      "FNCIREF1": "SI248001755",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 2600.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 763882,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-02-08T00:00:00+02:00",
                      "FNCNUM": "24003424",
                      "IVNUM": "SI248001756",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. לקוח מרכזת",
                      "SUM1": 812.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-08-06T00:00:00+03:00",
                      "FNCIREF1": "SI248001756",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 812.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 763883,
                      "KLINE": 1
                  },
                  {
                      "BALDATE": "2024-02-08T00:00:00+02:00",
                      "FNCNUM": "24003425",
                      "IVNUM": "SI248001757",
                      "FNCPATNAME": "חלמ",
                      "DETAILS": "חש. לקוח מרכזת",
                      "SUM1": 319.00,
                      "CODE": "ש'ח",
                      "FNCREF2": null,
                      "FNCDATE": "2024-08-06T00:00:00+03:00",
                      "FNCIREF1": "SI248001757",
                      "FNCIREF2": null,
                      "ORDNAME": null,
                      "FNCICODE": null,
                      "ACCNAME": "41101010",
                      "SUM5": 319.00,
                      "CODE5": "ש'ח",
                      "FNCTRANS": 763884,
                      "KLINE": 1
                  }
              ]
          }
      ]
  }
  }




}

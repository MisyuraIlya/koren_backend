import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CourseEntity } from 'src/course/entities/course.entity';
import axios, { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { TabEntity } from 'src/tab/entities/tab.entity';
import { TaskEntity } from 'src/task/entities/task.entity';
import { ColumnTaskEntity } from 'src/column_task/entities/columnTask.entity';
import { RowTaskEntity } from 'src/row_task/entities/rowTask.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { ValueEntity } from 'src/value/entities/value.entity';
import { convertTypeToEnum } from 'src/engine/convertTypeToEnum';
import { fetchPropertiesValue, fetchSpecialTypes } from 'src/engine/fetchSpecialTypes';
import { PdfUtilitiesEntity } from 'src/pdf-utilities/entities/pdf-utility.entity';

@Injectable()
export class CronService {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
        @InjectRepository(ExerciseEntity)
        private readonly exerciseRepository: Repository<ExerciseEntity>,
        @InjectRepository(TabEntity)
        private readonly tabRepository: Repository<TabEntity>,
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(ColumnTaskEntity)
        private readonly columnTaskRepository: Repository<ColumnTaskEntity>,
        @InjectRepository(RowTaskEntity)
        private readonly rowTaskRepository: Repository<RowTaskEntity> ,
        @InjectRepository(ObjectiveEntity)
        private readonly objectiveRepository: Repository<ObjectiveEntity> ,
        @InjectRepository(AnswerEntity)
        private readonly answerRepository: Repository<AnswerEntity> ,
        @InjectRepository(ValueEntity)
        private readonly valueRepository: Repository<ValueEntity>,
        @InjectRepository(PdfUtilitiesEntity)
        private readonly pdfUtilitiesEntityRepository: Repository<PdfUtilitiesEntity>
    ) {}

    // Use the @Cron decorator to schedule a task
    // @Cron(CronExpression.EVERY_MINUTE)
    // handleCron() {
    //     console.log('Executing cron job every minute');
    //     // You can perform any task here
    // }

    async fetchCourses() {
        try {
            const response: AxiosResponse<any> = await axios.get('http://3.71.75.160:4000/courses/all');
            const data = response.data;
            for (const element of data) {
                // if(data.id == 592){
                    const course = new CourseEntity();
                    course.uuid = element.id
                    course.name = element.name;
                    course.grade = element.grade;
                    course.level = element.level;
                    course.published = element.published;
                    course.color = element.color;
                    course.bgColor = element.bgColor;
                    course.orden =  element.orden;
                    // course.image = element.image; // Fix this line
                    if(element.pdf){
                        let replaced = element.pdf.replace("images/", "media/pdf/");
                        course.pdf = replaced;
                    }
                    const createdCourseLvl1 = await this.courseRepository.save(course);
    
                    if(element.children.length > 0){
                        element.children?.map(async (lvl2) => {
                            const courseLvl2 = new CourseEntity();
                            courseLvl2.uuid = lvl2.id
                            courseLvl2.name = lvl2.name;
                            courseLvl2.grade = lvl2.grade;
                            courseLvl2.level = lvl2.level;
                            courseLvl2.published = lvl2.published;
                            courseLvl2.color = lvl2.color;
                            courseLvl2.bgColor = lvl2.bgColor;
                            courseLvl2.parent = createdCourseLvl1
                            courseLvl2.orden =  lvl2.orden;
                            // course.image = element.image; // Fix this line
                            if(lvl2.pdf){
                                let replaced = lvl2.pdf.replace("images/", "media/pdf/");
                                courseLvl2.pdf = replaced;
                            }
                            const createdCourseLvl2 = await this.courseRepository.save(courseLvl2);
                            
                            if(lvl2.children.length > 0) {
                                lvl2.children.map(async (lvl3) => {
                                    const courseLvl3 = new CourseEntity();
                                    courseLvl3.uuid = lvl3.id
                                    courseLvl3.name = lvl3.name;
                                    courseLvl3.grade = lvl3.grade;
                                    courseLvl3.level = lvl3.level;
                                    courseLvl3.published = lvl3.published;
                                    courseLvl3.color = lvl3.color;
                                    courseLvl3.bgColor = lvl3.bgColor;
                                    courseLvl3.parent = createdCourseLvl2
                                    courseLvl3.orden =  lvl3.orden;
                                    // course.image = element.image; // Fix this line
                                    if(lvl3.pdf){
                                        let replaced = lvl3.pdf.replace("images/", "media/pdf/");
                                        courseLvl3.pdf = replaced;
                                    }
                                    const createdCourseLvl3 = await this.courseRepository.save(courseLvl3);
                                    
                                    if(lvl3.children.length > 0) {
                                        lvl3.children.map(async (lvl4) => {
                                            const courseLvl4 = new CourseEntity();
                                            courseLvl4.uuid = lvl4.id
                                            courseLvl4.name = lvl4.name;
                                            courseLvl4.grade = lvl4.grade;
                                            courseLvl4.level = lvl4.level;
                                            courseLvl4.published = lvl4.published;
                                            courseLvl4.color = lvl4.color;
                                            courseLvl4.bgColor = lvl4.bgColor;
                                            courseLvl4.parent = createdCourseLvl3
                                            courseLvl4.orden =  lvl4.orden;
                                            // course.image = element.image; // Fix this line
                                            if(lvl4.pdf){
                                                let replaced = lvl4.pdf.replace("images/", "media/pdf/");
                                                courseLvl4.pdf = replaced;
                                            }
                                            const createdCourseLvl4 = await this.courseRepository.save(courseLvl4);
                                            
                                            if(lvl4.children.length > 0) {
                                                lvl4.children.map(async (lvl5) => {
                                                    const courseLvl5 = new CourseEntity();
                                                    courseLvl5.uuid = lvl5.id
                                                    courseLvl5.name = lvl5.name;
                                                    courseLvl5.grade = lvl5.grade;
                                                    courseLvl5.level = lvl5.level;
                                                    courseLvl5.published = lvl5.published;
                                                    courseLvl5.color = lvl5.color;
                                                    courseLvl5.bgColor = lvl5.bgColor;
                                                    courseLvl5.orden =  lvl5.orden;
                                                    courseLvl5.parent = createdCourseLvl4
                                                    // course.image = element.image; // Fix this line
                                                    if(lvl5.pdf){
                                                        let replaced = lvl5.pdf.replace("images/", "media/pdf/");
                                                        courseLvl5.pdf = replaced;
                                                    }
                                                    await this.courseRepository.save(courseLvl5);
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                // }
            }

        } catch (error) {
            console.error('Error fetching data:', error.message);
            throw error;
        }
    }

    async fetchExercises() {
        try {
            
   
            const categoriesLvl5 = await this.courseRepository.find({
                where:{level:5}
            })
            if(categoriesLvl5){
                categoriesLvl5.map(async (course) => {
                    // if(course.uuid == '916'){
                        try {
                            const exercise: AxiosResponse<any> = await axios.get(`http://3.71.75.160:4000/exercises/${course.uuid}`);
                            const exerciseData = exercise.data;
                            if (Array.isArray(exerciseData)) {
                                this.syncArrayOfObjects(exerciseData,course.id)
                            } else {
                                this.syncObjectExercise(exerciseData, course.id)
                            }
                        } catch(e) {
                            console.log('[ERROR EXERCISE]', e , course.id)
                        }
                    // }
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            // throw error;
        } 
    }

    async handleSelectBox() {
        try {
            const categoriesLvl5 = await this.courseRepository.find({
                where: { level: 5 },
                relations: [
                    'exercises', 'exercises.tabs', 'exercises.tabs.tasks', 
                    'exercises.tabs.tasks.rows', 'exercises.tabs.tasks.rows.objectives', 
                    'exercises.tabs.tasks.rows.objectives.values'
                ]
            });
    
            for (const course of categoriesLvl5) {
                // if (course.uuid == '894') {
                    try {
                        const exerciseResponse: AxiosResponse<any> = await axios.get(`http://3.71.75.160:4000/exercises/${course.uuid}`);
                        const exerciseData = exerciseResponse.data;
                        if (Array.isArray(exerciseData)) {
                            // Process exerciseData if needed
                            exerciseData?.map(async (elem) => {
                                await this.MainLogicHandleSelectBox(elem,course)
                            })
                        } else if (course.exercises[0]?.title === exerciseData?.title) {
                            this.MainLogicHandleSelectBox(exerciseData,course)
                        } else {
                            console.log("NO");
                        }
                    } catch (e) {
                        console.log('[ERROR EXERCISE]', course.id, e);
                    }
                // }
            }
        } catch (error) {
            console.error('Error fetching data::', error.message);
            // throw error;
        }
    }

    async ordernPdfUtils(){
        const data = [{"id":1,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/17ee662a6ba6f6d2e8.pdf","orden":null,"exerciseId":577}, 
            {"id":2,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/0b5752101e889b28cb2.pdf","orden":null,"exerciseId":577}, 
            {"id":3,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/596fa66af6dd132628.pdf","orden":null,"exerciseId":577}, 
            {"id":4,"name":"תהליך כתיבת מאמר טיעון","pdf":"media/pdf/5ec38d1e48e53d8589.pdf","orden":null,"exerciseId":577}, 
            {"id":5,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/11044388d3d13c82634.pdf","orden":null,"exerciseId":577}, 
            {"id":6,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/b2610d50ff49c762869.pdf","orden":null,"exerciseId":577}, 
            {"id":7,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/e72f0c9531fead1792.pdf","orden":null,"exerciseId":577}, 
            {"id":8,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/ba1a7734ea4b17d1b8.pdf","orden":null,"exerciseId":577}, 
            {"id":9,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/c35db2e8036649baca.pdf","orden":null,"exerciseId":579}, 
            {"id":10,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/b010260fa6ebed9f32d.pdf","orden":null,"exerciseId":579}, 
            {"id":11,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/93a4e10c19ebba6981c.pdf","orden":null,"exerciseId":579}, 
            {"id":12,"name":"תהליך כתיבת מאמר טיעון","pdf":"media/pdf/86d97101ef7f52d107ad.pdf","orden":null,"exerciseId":579}, 
            {"id":13,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/10f2688e69109f9e314.pdf","orden":null,"exerciseId":579}, 
            {"id":14,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/14497ac13210a10cd86.pdf","orden":null,"exerciseId":579}, 
            {"id":15,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/ec57fecd50101233988.pdf","orden":null,"exerciseId":579}, 
            {"id":16,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/7ebc244a262182db9a.pdf","orden":null,"exerciseId":579}, 
            {"id":17,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/7610eee0f8ee32512e1.pdf","orden":null,"exerciseId":578}, 
            {"id":18,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/1a7037c14e36b3e244.pdf","orden":null,"exerciseId":578}, 
            {"id":19,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/9aaaeb9c42c2494b36.pdf","orden":null,"exerciseId":578}, 
            {"id":20,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/ab7c94ee19edfb819f.pdf","orden":null,"exerciseId":578}, 
            {"id":21,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/3b1015d78f4f2bb675c.pdf","orden":null,"exerciseId":578}, 
            {"id":22,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/9d6f1096bc19b3fd63a.pdf","orden":null,"exerciseId":578}, 
            {"id":23,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/e6bdb3b0a176e281d9.pdf","orden":null,"exerciseId":578}, 
            {"id":24,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/ae85a2dfa4888498e5.pdf","orden":null,"exerciseId":586}, 
            {"id":25,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/1dd8e1040c6b792adca.pdf","orden":null,"exerciseId":586}, 
            {"id":26,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/f7ff17bc4ca6cc38fa.pdf","orden":null,"exerciseId":586}, 
            {"id":27,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/199dad554c37756154.pdf","orden":null,"exerciseId":586}, 
            {"id":28,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/a104ed8be1a40ed6f78.pdf","orden":null,"exerciseId":586}, 
            {"id":29,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/54d78ab21bc936910d0.pdf","orden":null,"exerciseId":586}, 
            {"id":30,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/1c64a6ff319659df21.pdf","orden":null,"exerciseId":586}, 
            {"id":31,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/b0eea9ce17a35cb529.pdf","orden":null,"exerciseId":588}, 
            {"id":32,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/b52c32a52b108c0c63d.pdf","orden":null,"exerciseId":588}, 
            {"id":33,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/1101c9f5efa41c29b38.pdf","orden":null,"exerciseId":588}, 
            {"id":34,"name":"‏‏הנאום","pdf":"media/pdf/49965493bbf68516d9.pdf","orden":null,"exerciseId":588}, 
            {"id":35,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/85ee379107c1096bb4a1.pdf","orden":null,"exerciseId":588}, 
            {"id":36,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/fb4511c72b6235425c.pdf","orden":null,"exerciseId":588}, 
            {"id":37,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/d61018366e4f51461089.pdf","orden":null,"exerciseId":588}, 
            {"id":38,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/c854a7116f91027df80.pdf","orden":null,"exerciseId":588}, 
            {"id":39,"name":"אמצעים רטוריים","pdf":"media/pdf/713b80eb938e2e3bdf.pdf","orden":null,"exerciseId":588}, 
            {"id":40,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/8a108cedb4bfc220ff10.pdf","orden":null,"exerciseId":589}, 
            {"id":41,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/b35f6d53cb45df7e52.pdf","orden":null,"exerciseId":589}, 
            {"id":42,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/f6869cf31c86cb36fd.pdf","orden":null,"exerciseId":589}, 
            {"id":43,"name":"תהליך כתיבת מאמר טיעון","pdf":"media/pdf/72d5b959d7a575210d4.pdf","orden":null,"exerciseId":589}, 
            {"id":44,"name":"מכתב תגובה ומאמר תגובה","pdf":"media/pdf/f268496862a43f1e6b.pdf","orden":null,"exerciseId":589}, 
            {"id":45,"name":"אמצעים רטוריים","pdf":"media/pdf/119026973110e82f2ae.pdf","orden":null,"exerciseId":589}, 
            {"id":46,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/10d934ff10f6ff097d4a.pdf","orden":null,"exerciseId":589}, 
            {"id":47,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/cb7d925c1eb5058c34.pdf","orden":null,"exerciseId":589}, 
            {"id":48,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/c44ee81c647d79ba40.pdf","orden":null,"exerciseId":589}, 
            {"id":49,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/9c10b8aacf7852390b8.pdf","orden":null,"exerciseId":589}, 
            {"id":50,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/34d51045dee2f5f3a23.pdf","orden":null,"exerciseId":606}, 
            {"id":51,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/e0a7afa4b2f107cbd84.pdf","orden":null,"exerciseId":606}, 
            {"id":52,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/b10e28427fa3dea6c9b.pdf","orden":null,"exerciseId":606}, 
            {"id":53,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/3a64966833d367b64e.pdf","orden":null,"exerciseId":606}, 
            {"id":54,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/e73c3830c7c24744e6.pdf","orden":null,"exerciseId":606}, 
            {"id":55,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/b10210450e8b228921c1.pdf","orden":null,"exerciseId":606}, 
            {"id":56,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/b8fa1610d0b238f324b.pdf","orden":null,"exerciseId":606}, 
            {"id":57,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/7d10fa9dd1dde4932f.pdf","orden":null,"exerciseId":606}, 
            {"id":58,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/2c26f1b2b632ea61d2.pdf","orden":null,"exerciseId":632}, 
            {"id":59,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/da8810df6f12579e18.pdf","orden":null,"exerciseId":632}, 
            {"id":60,"name":"‏‏מכתב תגובה ומאמר תגובה","pdf":"media/pdf/6ca7a37cb1eaa10c86b.pdf","orden":null,"exerciseId":632}, 
            {"id":61,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/235456ac93be8c96dd.pdf","orden":null,"exerciseId":632}, 
            {"id":62,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/a3bf7323443792d1a6.pdf","orden":null,"exerciseId":632}, 
            {"id":63,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/9ffbcd89be21e797da.pdf","orden":null,"exerciseId":632}, 
            {"id":64,"name":"אמצעים רטוריים","pdf":"media/pdf/58de6745c6671a10b49.pdf","orden":null,"exerciseId":632}, 
            {"id":65,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/440564d18c8a310434c.pdf","orden":null,"exerciseId":632}, 
            {"id":66,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/0e317b10a410251c66a0.pdf","orden":null,"exerciseId":632}, 
            {"id":67,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/c8467c26d310c9c0d7a.pdf","orden":null,"exerciseId":633}, 
            {"id":68,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/6e0c1215658ee7ec11.pdf","orden":null,"exerciseId":633}, 
            {"id":69,"name":"מכתב תגובה ומאמר תגובה","pdf":"media/pdf/8753613b9f3a4787c10.pdf","orden":null,"exerciseId":633}, 
            {"id":77,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/dc6f41fd4633b7ce55.pdf","orden":null,"exerciseId":660}, 
            {"id":86,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/5b7e2d97de671ae3d2.pdf","orden":null,"exerciseId":699}, 
            {"id":96,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/0d9fbee40e30f49530.pdf","orden":null,"exerciseId":717}, 
            {"id":105,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/41b76dd101b9115db19.pdf","orden":null,"exerciseId":727}, 
            {"id":116,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/b42881472ebd74a560.pdf","orden":null,"exerciseId":764}, 
            {"id":128,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/10704de62d3b47a10f1a.pdf","orden":null,"exerciseId":781}, 
            {"id":135,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/ff25c2e393ff3e582d.pdf","orden":null,"exerciseId":785}, 
            {"id":70,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/91128679c6a5daddd2.pdf","orden":null,"exerciseId":633}, 
            {"id":83,"name":"צווותי חשיבה - חסרונות","pdf":"media/pdf/36a61fb93d4328204f.pdf","orden":null,"exerciseId":693}, 
            {"id":88,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/00e1eca102110eda5efd.pdf","orden":null,"exerciseId":699}, 
            {"id":95,"name":"הטקסט ההיצגי","pdf":"media/pdf/e138cf561c820982fa.pdf","orden":null,"exerciseId":717}, 
            {"id":106,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/6ee28711106e9d3c426.pdf","orden":null,"exerciseId":727}, 
            {"id":109,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/b31010c3131079dc3d13e.pdf","orden":null,"exerciseId":754}, 
            {"id":137,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/e4fd4b5fbcaca92a410.pdf","orden":null,"exerciseId":785}, 
            {"id":71,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/b501932322371c59e9.pdf","orden":null,"exerciseId":633}, 
            {"id":78,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/716426d99eccda492a.pdf","orden":null,"exerciseId":660}, 
            {"id":90,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/1068b520eefadeb7797.pdf","orden":null,"exerciseId":699}, 
            {"id":99,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/6541fb76e83392394a.pdf","orden":null,"exerciseId":717}, 
            {"id":102,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/879b5caeb186c32a52.pdf","orden":null,"exerciseId":727}, 
            {"id":115,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/c83e95fc5b8275879f.pdf","orden":null,"exerciseId":764}, 
            {"id":124,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/fc434de69eba84e54d.pdf","orden":null,"exerciseId":781}, 
            {"id":72,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/18adc83681757434bf.pdf","orden":null,"exerciseId":633}, 
            {"id":79,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/b10322e14d6e4c955fa.pdf","orden":null,"exerciseId":660}, 
            {"id":89,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/edd1012d934dd6560c9.pdf","orden":null,"exerciseId":699}, 
            {"id":107,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/192f93cabe3ac7e06c.pdf","orden":null,"exerciseId":727}, 
            {"id":112,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/7f93d2bd72fc8897f0.pdf","orden":null,"exerciseId":754}, 
            {"id":120,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/10d827ae3e3f78a64c1.pdf","orden":null,"exerciseId":764}, 
            {"id":127,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/1661076748610bd4dd109.pdf","orden":null,"exerciseId":781}, 
            {"id":73,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/b2623107e8cee95434c.pdf","orden":null,"exerciseId":633}, 
            {"id":76,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/10022918f95ebbe92b2.pdf","orden":null,"exerciseId":660}, 
            {"id":91,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/e887d42e2e121ad38c.pdf","orden":null,"exerciseId":699}, 
            {"id":94,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/cde4132faa5ca8332d.pdf","orden":null,"exerciseId":717}, 
            {"id":108,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/38dab15cce85ed95b2.pdf","orden":null,"exerciseId":727}, 
            {"id":125,"name":"תהליך כתיבת מאמר טיעון","pdf":"media/pdf/c12581191bb10416ce4.pdf","orden":null,"exerciseId":781}, 
            {"id":138,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/aee168358423f227d3.pdf","orden":null,"exerciseId":785}, 
            {"id":74,"name":"צווותי חשיבה - יתרונות","pdf":"media/pdf/d11bf6e9f3b4bad560.pdf","orden":null,"exerciseId":646}, 
            {"id":75,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/10710e641010942f585f80.pdf","orden":null,"exerciseId":660}, 
            {"id":85,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/27fcb2c124d090a8b1.pdf","orden":null,"exerciseId":699}, 
            {"id":100,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/ec1212738f182db421.pdf","orden":null,"exerciseId":717}, 
            {"id":122,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/828f7b3c81fa1044f43.pdf","orden":null,"exerciseId":764}, 
            {"id":130,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/cd3f43bfcdcea312c4.pdf","orden":null,"exerciseId":781}, 
            {"id":134,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/a2fd8b78fd5a79376b.pdf","orden":null,"exerciseId":785}, 
            {"id":80,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/8b941fe710df67a5bc0.pdf","orden":null,"exerciseId":660}, 
            {"id":97,"name":"אמצעים רטוריים","pdf":"media/pdf/d57dcc3eb8da579673.pdf","orden":null,"exerciseId":717}, 
            {"id":104,"name":"‏‏מכתב תגובה ומאמר תגובה","pdf":"media/pdf/a6118b203eaa0e88f2.pdf","orden":null,"exerciseId":727}, 
            {"id":114,"name":"פרגמטיקה - זמנים","pdf":"media/pdf/65eba86d0910a18896e.pdf","orden":null,"exerciseId":754}, 
            {"id":117,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/89337f6f446f3f3793.pdf","orden":null,"exerciseId":764}, 
            {"id":123,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/9e1055a3bf4af44618f.pdf","orden":null,"exerciseId":781}, 
            {"id":132,"name":"הטקסט ההיצגי","pdf":"media/pdf/e625c2a8e9ba29f9ae.pdf","orden":null,"exerciseId":785}, 
            {"id":81,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/52710b9d935a3010aa89.pdf","orden":null,"exerciseId":660}, 
            {"id":84,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/d17c733425ea81ab48.pdf","orden":null,"exerciseId":699}, 
            {"id":93,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/6bd9705adb9952d258.pdf","orden":null,"exerciseId":717}, 
            {"id":111,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/4f1f55101102289a8e1e.pdf","orden":null,"exerciseId":754}, 
            {"id":119,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/cbfc75b1271d67ec51.pdf","orden":null,"exerciseId":764}, 
            {"id":129,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/8401afed8b96e4699b.pdf","orden":null,"exerciseId":781}, 
            {"id":136,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/10466ace5c9e0d2f2e3.pdf","orden":null,"exerciseId":785}, 
            {"id":82,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/206b8bf3851ceb8444.pdf","orden":null,"exerciseId":660}, 
            {"id":92,"name":"השימושים הרטוריים במערכת הצורות","pdf":"media/pdf/1ed55f210101a2d104dc4.pdf","orden":null,"exerciseId":700}, 
            {"id":98,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/4f7e3e4146c610335ed.pdf","orden":null,"exerciseId":717}, 
            {"id":103,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/265910044f36a89103ab.pdf","orden":null,"exerciseId":727}, 
            {"id":113,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/942035b8278fea7591.pdf","orden":null,"exerciseId":754}, 
            {"id":118,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/0d62a7ce94d153d1f3.pdf","orden":null,"exerciseId":764}, 
            {"id":131,"name":"אמצעים רטוריים","pdf":"media/pdf/37e24961b50108f9c9c.pdf","orden":null,"exerciseId":781}, 
            {"id":133,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/5df1ec23c549fe4932.pdf","orden":null,"exerciseId":785}, 
            {"id":87,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/2fa726c810b69385048.pdf","orden":null,"exerciseId":699}, 
            {"id":101,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/ed6a11075ffcf199527.pdf","orden":null,"exerciseId":717}, 
            {"id":110,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/8656ebc63f93cfae7b.pdf","orden":null,"exerciseId":754}, 
            {"id":121,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/9a1010bd10b3a65e68f9.pdf","orden":null,"exerciseId":764}, 
            {"id":126,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/57cf446533856b28f6.pdf","orden":null,"exerciseId":781}, 
            {"id":139,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/e6b57a10bb21b907d4c.pdf","orden":null,"exerciseId":806}, 
            {"id":140,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/10342ec637f55303b19.pdf","orden":null,"exerciseId":806}, 
            {"id":141,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/765a0f4eb8fbb02a52.pdf","orden":null,"exerciseId":806}, 
            {"id":142,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/4ca54d8ebaebb2486a.pdf","orden":null,"exerciseId":806}, 
            {"id":143,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/51c32fb4d3bc8710fab.pdf","orden":null,"exerciseId":806}, 
            {"id":144,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/84e0dbdfcdce230c106.pdf","orden":null,"exerciseId":806}, 
            {"id":145,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/afa8a3d86bde41b0a4.pdf","orden":null,"exerciseId":806}, 
            {"id":146,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/e0d4cc9bf1b333e6ed.pdf","orden":null,"exerciseId":806}, 
            {"id":147,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/df41de5cc10b898acab.pdf","orden":null,"exerciseId":843}, 
            {"id":148,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/031c3610de66104bb243.pdf","orden":null,"exerciseId":843}, 
            {"id":149,"name":"‏‏הנאום","pdf":"media/pdf/5bc6aa9664a2b696c0.pdf","orden":null,"exerciseId":843}, 
            {"id":150,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/af16f024758a101491d.pdf","orden":null,"exerciseId":843}, 
            {"id":151,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/c89b8f727453610f53b.pdf","orden":null,"exerciseId":843}, 
            {"id":152,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/24f66953d3f4d386108.pdf","orden":null,"exerciseId":843}, 
            {"id":153,"name":"אמצעים רטוריים","pdf":"media/pdf/ea0b410f882ccc270aa.pdf","orden":null,"exerciseId":843}, 
            {"id":154,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/e6fb10105c228a110e210a.pdf","orden":null,"exerciseId":843}, 
            {"id":155,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/e46bbc6692537dd393.pdf","orden":null,"exerciseId":843}, 
            {"id":156,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/168947fb391b537de8.pdf","orden":null,"exerciseId":862}, 
            {"id":157,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/643bd1b8cec5e63aa5.pdf","orden":null,"exerciseId":862}, 
            {"id":158,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/d1cd72ae8445880490.pdf","orden":null,"exerciseId":862}, 
            {"id":159,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/52710279bb1c9c0e8b5.pdf","orden":null,"exerciseId":862}, 
            {"id":160,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/e3f37d4310874729b210.pdf","orden":null,"exerciseId":862}, 
            {"id":161,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/fd928fda464bc9ab3a.pdf","orden":null,"exerciseId":862}, 
            {"id":162,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/009de6c7cecaa48ff9.pdf","orden":null,"exerciseId":862}, 
            {"id":163,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/9810e9f082d1c44265d.pdf","orden":null,"exerciseId":862}, 
            {"id":164,"name":"‏‏הנאום","pdf":"media/pdf/8bb89b76015407aa75.pdf","orden":null,"exerciseId":882}, 
            {"id":165,"name":"אמצעים רטוריים","pdf":"media/pdf/2982cff97c9644b976.pdf","orden":null,"exerciseId":882}, 
            {"id":166,"name":"ג1-רכיבי מאמר טיעון","pdf":"media/pdf/aca214e3bef25d6743.pdf","orden":null,"exerciseId":895}, 
            {"id":167,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/7dc101543f1a5ba408.pdf","orden":null,"exerciseId":906}, 
            {"id":168,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/06e87e581271fca78c.pdf","orden":null,"exerciseId":906}, 
            {"id":169,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/35ae6bdb59c06a591010.pdf","orden":null,"exerciseId":906}, 
            {"id":170,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/d10cb010fe5b124fb939.pdf","orden":null,"exerciseId":906}, 
            {"id":171,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/c46d7e4444a19cc1da.pdf","orden":null,"exerciseId":906}, 
            {"id":172,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/caef284f39bbedf6e6.pdf","orden":null,"exerciseId":906}, 
            {"id":173,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/f677dd8d8dbba10c38d.pdf","orden":null,"exerciseId":906}, 
            {"id":174,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/9af10475410cf8fc8c46.pdf","orden":null,"exerciseId":906}, 
            {"id":175,"name":"פרגמטיקה - זמנים","pdf":"media/pdf/7d9b310b83c00875c44.pdf","orden":null,"exerciseId":920}, 
            {"id":176,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/8f2b1678105ab79102d5.pdf","orden":null,"exerciseId":944}, 
            {"id":177,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/557668db37e78dc10af.pdf","orden":null,"exerciseId":944}, 
            {"id":178,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/fcb11c2ab17e584ccc.pdf","orden":null,"exerciseId":944}, 
            {"id":179,"name":"תהליך כתיבת מאמר טיעון","pdf":"media/pdf/1d9c1062ee4e3850e109.pdf","orden":null,"exerciseId":944}, 
            {"id":180,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/b0c732a9bdc2107910aa.pdf","orden":null,"exerciseId":944}, 
            {"id":181,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/aaa13f6dfd5d92b714.pdf","orden":null,"exerciseId":944}, 
            {"id":182,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/7ebf93d98c28cab354.pdf","orden":null,"exerciseId":944}, 
            {"id":183,"name":"אמצעים רטוריים","pdf":"media/pdf/367c5f1407e9655e54.pdf","orden":null,"exerciseId":944}, 
            {"id":184,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/8510810cb87036fc5443.pdf","orden":null,"exerciseId":944}, 
            {"id":185,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/b6106ba51a3d54ac23d.pdf","orden":null,"exerciseId":958}, 
            {"id":186,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/8231351054b86a6dd83.pdf","orden":null,"exerciseId":958}, 
            {"id":187,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/6ab48814e88810f2bd3.pdf","orden":null,"exerciseId":958}, 
            {"id":188,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/b7e6b172b8f2c1010fde.pdf","orden":null,"exerciseId":958}, 
            {"id":189,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/f75b9524661c267e93.pdf","orden":null,"exerciseId":958}, 
            {"id":190,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/e5a6a10fc613cab10c7a.pdf","orden":null,"exerciseId":958}, 
            {"id":191,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/27956af1376f7b1ed3.pdf","orden":null,"exerciseId":958}, 
            {"id":192,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/ef70d2710710fae810a4.pdf","orden":null,"exerciseId":958}, 
            {"id":193,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/473694fd3510b85158e.pdf","orden":null,"exerciseId":984}, 
            {"id":194,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/71061ba4e65b13769f8.pdf","orden":null,"exerciseId":984}, 
            {"id":195,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/9d972c3e909b6f6142.pdf","orden":null,"exerciseId":984}, 
            {"id":196,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/8995d1c51671319a18.pdf","orden":null,"exerciseId":984}, 
            {"id":197,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/d093210ff15ccdc7104f.pdf","orden":null,"exerciseId":984}, 
            {"id":198,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/c103493aa921b0f2d73.pdf","orden":null,"exerciseId":984}, 
            {"id":199,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/311f2e1449b451054fa.pdf","orden":null,"exerciseId":984}, 
            {"id":200,"name":"אמצעים רטוריים","pdf":"media/pdf/30da1026ec72f3de649.pdf","orden":null,"exerciseId":984}, 
            {"id":201,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/d58cc832b955cefd3a.pdf","orden":null,"exerciseId":985}, 
            {"id":202,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/e410279c7a268aabeb.pdf","orden":null,"exerciseId":985}, 
            {"id":203,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/13b927a11510029c6e3.pdf","orden":null,"exerciseId":985}, 
            {"id":211,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/354afe7db161cdc947.pdf","orden":null,"exerciseId":1012}, 
            {"id":228,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/d6674cdfc5b5d33558.pdf","orden":null,"exerciseId":1059}, 
            {"id":204,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/bf34ea65d67c78d9c4.pdf","orden":null,"exerciseId":985}, 
            {"id":220,"name":"סוגי פתיחות וסיומים","pdf":"media/pdf/ea8acbc9c062c31041b.pdf","orden":null,"exerciseId":1045}, 
            {"id":205,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/a099e2a452ca3181ee.pdf","orden":null,"exerciseId":985}, 
            {"id":223,"name":"בנק משובים - משובים חיוביים","pdf":"media/pdf/21197fbf4655bcd5b6.pdf","orden":null,"exerciseId":1045}, 
            {"id":230,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/4e3247029035665355.pdf","orden":null,"exerciseId":1059}, 
            {"id":206,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/8ab713e6ea122dc9b9.pdf","orden":null,"exerciseId":985}, 
            {"id":213,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/296076d37f61eeaaa1.pdf","orden":null,"exerciseId":1012}, 
            {"id":229,"name":"שלב ד - משפטי קישור, דרכי מסירה ופועלי אמירה","pdf":"media/pdf/b4cc06ce91ec66c531.pdf","orden":null,"exerciseId":1059}, 
            {"id":207,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/9ed910d94821df70b75.pdf","orden":null,"exerciseId":1012}, 
            {"id":215,"name":"‏‏הנאום","pdf":"media/pdf/56cb5b1069ca59bb437.pdf","orden":null,"exerciseId":1033}, 
            {"id":218,"name":"מבנים שונים של מאמר טיעון","pdf":"media/pdf/ca93e87d47104241c10a.pdf","orden":null,"exerciseId":1045}, 
            {"id":232,"name":"בנק משובים - סקירה ממזגת","pdf":"media/pdf/bde17521ed7d675d35.pdf","orden":null,"exerciseId":1059}, 
            {"id":208,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/e948dab025103357264.pdf","orden":null,"exerciseId":1012}, 
            {"id":221,"name":"מילות קישור לכתיבה טיעונית","pdf":"media/pdf/34c1045de7b67a49ee9.pdf","orden":null,"exerciseId":1045}, 
            {"id":226,"name":"שלב ב - איתור המידע (השמטה)","pdf":"media/pdf/cbc10d5115f8d5d41df.pdf","orden":null,"exerciseId":1059}, 
            {"id":209,"name":"שלב ד - עקרונות ההבניה","pdf":"media/pdf/b32b3c649aaf644fd0.pdf","orden":null,"exerciseId":1012}, 
            {"id":217,"name":"רכיבי מאמר טיעון","pdf":"media/pdf/9d11797010610a37bfb.pdf","orden":null,"exerciseId":1045}, 
            {"id":224,"name":"אמצעים רטוריים","pdf":"media/pdf/1d1043c8d5bb87c10ff1.pdf","orden":null,"exerciseId":1045}, 
            {"id":233,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/aa7100357946309cab2.pdf","orden":null,"exerciseId":1059}, 
            {"id":210,"name":"שלב ה - רישום ביבליוגרפי","pdf":"media/pdf/21ff10120c99293d10b7.pdf","orden":null,"exerciseId":1012}, 
            {"id":219,"name":"מכתב תגובה ומאמר תגובה","pdf":"media/pdf/c3b4e7e10fd935fb437.pdf","orden":null,"exerciseId":1045}, 
            {"id":231,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/b378efa6b8bda06c05.pdf","orden":null,"exerciseId":1059}, 
            {"id":212,"name":"מחוון לכתיבה ממזגת","pdf":"media/pdf/68f85985d425e79410c.pdf","orden":null,"exerciseId":1012}, 
            {"id":225,"name":"‏‏בנק משובים - משובים לשיפור הכתיבה","pdf":"media/pdf/56fa1e937dd81de583.pdf","orden":null,"exerciseId":1045}, 
            {"id":214,"name":"שלב ו - הערכה ושכתוב","pdf":"media/pdf/9604cb1a76103973107.pdf","orden":null,"exerciseId":1012}, 
            {"id":216,"name":"אמצעים רטוריים","pdf":"media/pdf/46f9d99ba524699d103.pdf","orden":null,"exerciseId":1033}, 
            {"id":222,"name":"מַחְוָן לכתיבת מאמר טיעון","pdf":"media/pdf/07d7b2d2a1edd8fd24.pdf","orden":null,"exerciseId":1045}, 
            {"id":227,"name":"שלב ג - ארגון המידע (הכללה)","pdf":"media/pdf/72afc7d289c5f31b47.pdf","orden":null,"exerciseId":1059}]

        data?.forEach(async element => {
            const pdfUti = await this.pdfUtilitiesEntityRepository.findOne({
                where:{pdf:element.pdf}
            })
            if(pdfUti){
                pdfUti.orden = element.id
                this.pdfUtilitiesEntityRepository.save(pdfUti)
            }
        });     
    }

    private async MainLogicHandleSelectBox(exerciseData,course){
        for (const item of exerciseData.exercises) {
            const propertyName = `exercise${item.exercise}`;
            for (const subItem of item[propertyName].data) {
                for (const row of subItem.collectionsRows) {
                    for (const objc of row.collectionRow) {
                        if (objc.module_type === 'selectbox' || objc.module_type === 'checkBox') {
                            for (const val of objc.collectionValues) {
                                for (const ele1 of course.exercises[0]?.tabs || []) {
                                    for (const ele2 of ele1?.tasks || []) {
                                        for (const ele3 of ele2?.rows || []) {
                                            for (const ele4 of ele3?.objectives || []) {
                                                if (ele4.moduleType === 'selectbox' || ele4.moduleType === 'checkBox') {
                                                    for (const ele5 of ele4?.values || []) {
                                                        if (ele5?.value === val.value) {
                                                            if(ele5.orden == null){
                                                                ele5.orden = val.id;
                                                                await this.valueRepository.save(ele5);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private async syncObjectExercise(exerciseData, courseId) {
        if(exerciseData?.course?.name && exerciseData.module > 1) {
            const findCourse = await this.courseRepository.findOne({
                where:{uuid: exerciseData.course.id, level:5}
            })
            if(findCourse){
                const newExercise = new ExerciseEntity();
                newExercise.course = findCourse;
                newExercise.title = exerciseData.title
                newExercise.module = exerciseData.module
                newExercise.pdf = exerciseData.pdf
                newExercise.youtubeLink = exerciseData.youtube_link
                newExercise.description1 = exerciseData.description
                newExercise.description2 = exerciseData.description2
                const createdExercise = await this.exerciseRepository.save(newExercise);
                this.handlePdfUtitilies(exerciseData.pdfUtilities,createdExercise)
                if(createdExercise){
                    const createTab = new TabEntity();
                    createTab.exercise = createdExercise;
                    createTab.orden = 0;
                    createTab.title = null;
                    const createdTab = await this.tabRepository.save(createTab);

                    if(createdTab) {
                        exerciseData.exercises.map(async (item,index) => {

                            // if(createdTask){
                                const exercise = item.exercise
                                const propertyName = `exercise${exercise}`;
                                item[propertyName].data.map(async (subItem) => {
                                    const createTask = new TaskEntity();
                                    createTask.tab = createTab;
                                    createTask.orden = index
                                    createTask.specialModuleType = fetchSpecialTypes(item)
                                    createTask.properties = fetchPropertiesValue(item)
                                    const createdTask = await this.taskRepository.save(createTask)    
                                    if(createdTask){
                                        subItem.collectionsCols.map(async (col,index2) => {
                                            const createColumnTask = new ColumnTaskEntity();
                                            createColumnTask.title = col.title
                                            createColumnTask.orden = index2
                                            createColumnTask.type = convertTypeToEnum(col.type)
                                            createColumnTask.task = createdTask
                                            await this.columnTaskRepository.save(createColumnTask)
                                        })
    
                                        subItem.collectionsRows.map(async (row) => {
                                            const createRowTask = new RowTaskEntity();
                                            createRowTask.pdf = row.pdf
                                            createRowTask.youtubeLink = row.youtube_link
                                            createRowTask.orden = row.orden
                                            createRowTask.task = createdTask
                                            const createdRow = await this.rowTaskRepository.save(createRowTask)
    
                                            if(createdRow){
                                                row.collectionRow.map(async (objc) => {
                                                    if(objc.module_type !== 'explanation') {
                                                        const createObjective = new ObjectiveEntity();
                                                        createObjective.moduleType = objc.module_type
                                                        createObjective.orden = objc.orden
                                                        createObjective.isFullText = objc.isFullText
                                                        createObjective.placeholder = objc.placeholder
                                                        createObjective.rowTask = createdRow
                                                        const createdObjective = await this.objectiveRepository.save(createObjective)
                                                        if(createdObjective){
                                                            objc.collectionAnswers.map(async (ans) => {
                                                                const createAnswer = new AnswerEntity();
                                                                createAnswer.value = ans.value
                                                                createAnswer.objective = createdObjective
                                                                await this.answerRepository.save(createAnswer)
                                                            })
                                                            objc.collectionValues.map(async (val) => {
                                                                const createValue = new ValueEntity();
                                                                createValue.value = val.value
                                                                createValue.objective = createdObjective
                                                                await this.valueRepository.save(createValue)
                                                            })
        
                                                        }
                                                    } else {
                                                        this.HandleExplanation(objc, createdTask,row.orden)
                                                    }
                                                })
                                            }
    
                                        })
                                    }
                                })
            
                            // }  
                        })
                    }
                }
            }
        } else {
            console.log('no exercises in',courseId)
        }
    }

    private async syncArrayOfObjects(exerciseData, courseId) {

        const findCourse = await this.courseRepository.findOne({
            where:{name: exerciseData[0].course.name, level:5}
        })

        const newExercise = new ExerciseEntity();
        newExercise.course = findCourse;
        newExercise.title = exerciseData[0].title
        newExercise.module = exerciseData[0].module
        newExercise.pdf = exerciseData[0].pdf
        newExercise.youtubeLink = exerciseData[0].youtube_link
        newExercise.description1 = exerciseData[0].description
        newExercise.description2 = exerciseData[0].description2
        const createdExercise = await this.exerciseRepository.save(newExercise);
        this.handlePdfUtitilies(exerciseData[0].pdfUtilities,createdExercise)
        if(createdExercise){
            exerciseData?.map(async (tab,index) => {
                const createTab = new TabEntity();
                createTab.exercise = createdExercise;
                createTab.orden = tab.tabOrden;
                createTab.title = tab.tab;
                const createdTab = await this.tabRepository.save(createTab);
                let orden = 1 
                if(createdTab) {
                    tab.exercises.map(async (item,index1) => {
                        // if(createdTask){
                            const exercise = item.exercise
                            const propertyName = `exercise${exercise}`;
                            item[propertyName].data.map(async (subItem,index2) => {
                                const createTask = new TaskEntity();
                                createTask.tab = createTab;
                                createTask.orden =  parseFloat(`${orden}.${subItem.orden}`);
                                orden++
                                createTask.specialModuleType = fetchSpecialTypes(item)
                                createTask.properties = fetchPropertiesValue(item)
                                const createdTask = await this.taskRepository.save(createTask)  

                                if(createdTask){
                                    subItem.collectionsCols.map(async (col) => {
                                        const createColumnTask = new ColumnTaskEntity();
                                        createColumnTask.title = col.title
                                        createColumnTask.orden = col.orden
                                        createColumnTask.type = convertTypeToEnum(col.type)
                                        createColumnTask.task = createdTask
                                        await this.columnTaskRepository.save(createColumnTask)
                                    })
    
                                    subItem.collectionsRows.map(async (row) => {
                                        const createRowTask = new RowTaskEntity();
                                        createRowTask.pdf = row.pdf
                                        createRowTask.youtubeLink = row.youtube_link
                                        createRowTask.orden = row.orden
                                        createRowTask.task = createdTask
                                        const createdRow = await this.rowTaskRepository.save(createRowTask)
    
                                        if(createdRow){
                                            row.collectionRow.map(async (objc) => {
                                                if(objc.module_type !== 'explanation') {
                                                    const createObjective = new ObjectiveEntity();
                                                    createObjective.moduleType = objc.module_type
                                                    createObjective.orden = objc.orden
                                                    createObjective.isFullText = objc.isFullText
                                                    createObjective.placeholder = objc.placeholder
                                                    createObjective.rowTask = createdRow
                                                    const createdObjective = await this.objectiveRepository.save(createObjective)
                                                    if(createdObjective){
                                                        objc.collectionAnswers.map(async (ans) => {
                                                            const createAnswer = new AnswerEntity();
                                                            createAnswer.value = ans.value
                                                            createAnswer.objective = createdObjective
                                                            await this.answerRepository.save(createAnswer)
                                                        })
                                                        objc.collectionValues.map(async (val) => {
                                                            const createValue = new ValueEntity();
                                                            createValue.value = val.value
                                                            createValue.objective = createdObjective
                                                            await this.valueRepository.save(createValue)
                                                        })
    
                                                    }
                                                } else {
                                                    this.HandleExplanation(objc, createdTask,row.orden)
                                                }
                                            })
                                        }
    
                                    })
                                }
                            })
        
                        // }  
                    })
                }
            })
        }


    }

    private async HandleExplanation(objc,createdTask,orden) {
        const createRowTask = new RowTaskEntity();
        createRowTask.pdf = ''
        createRowTask.youtubeLink = ''
        createRowTask.orden = orden
        createRowTask.task = createdTask
        const createdRow = await this.rowTaskRepository.save(createRowTask)
        if(createdRow) {
            const createObjective = new ObjectiveEntity();
            createObjective.moduleType = objc.module_type
            createObjective.orden = objc.orden
            createObjective.isFullText = objc.isFullText
            createObjective.placeholder = objc.placeholder
            createObjective.rowTask = createdRow
            const createdObjective = await this.objectiveRepository.save(createObjective)
            if(createdObjective){
                objc.collectionValues.map(async (val) => {
                    const createValue = new ValueEntity();
                    createValue.value = val.value
                    createValue.objective = createdObjective
                    await this.valueRepository.save(createValue)
                })

            }
        }

    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handlePdfUtitilies(data, exercise: ExerciseEntity){
        data?.map((item) => {
            const newPdf = new PdfUtilitiesEntity();
            newPdf.exercise = exercise
            newPdf.name = item.name;
            newPdf.orden = item.ordern
            newPdf.pdf = item.pdf.replace(/^images\//, 'media/pdf/'); 
            this.pdfUtilitiesEntityRepository.save(newPdf)
        })
    }
    
}
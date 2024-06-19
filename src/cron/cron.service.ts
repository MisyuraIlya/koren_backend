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
            const response: AxiosResponse<any> = await axios.get('http://3.74.228.194:4000/courses/all');
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
                            const exercise: AxiosResponse<any> = await axios.get(`http://3.74.228.194:4000/exercises/${course.uuid}`);
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
            throw error;
        } 
    }

    private async syncObjectExercise(exerciseData, courseId) {
        if(exerciseData?.course?.name && exerciseData.module > 1) {
            const findCourse = await this.courseRepository.findOne({
                where:{name: exerciseData.course.name, level:5}
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
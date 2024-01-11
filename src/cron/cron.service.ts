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
        private readonly valueRepository: Repository<ValueEntity>
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
                const course = new CourseEntity();
                course.name = element.name;
                course.grade = element.grade;
                course.level = element.level;
                course.published = element.published;
                course.color = element.color;
                course.bgColor = element.bgColor;
                course.image = element.image; // Fix this line
                course.pdf = element.pdf;
            
                if (element.parent && element.parent.name) { // Check if element.parent exists and has a name property
                    const findParent = await this.courseRepository.findOne({
                        where: { name: element.parent.name }
                    });
            
                    if (findParent) {
                        course.parent = findParent;
                    }
                }
            
                await this.courseRepository.save(course);
            }

        } catch (error) {
            console.error('Error fetching data:', error.message);
            throw error;
        }
    }

    async fetchExercises() {
        try {
            
        for(let i = 1; i < 700; i++) {
            const response: AxiosResponse<any> = await axios.get(`http://3.74.228.194:4000/exercises/${i}`);
            const data = response.data;
            console.log('data',i,data)
            if(data){
                if (Array.isArray(data)) {
     
                } else {
                    const findCourse = await this.courseRepository.findOne({
                        where:{name: data.course.name}
                    })
                    if(findCourse){
                        const newExercise = new ExerciseEntity();
                        newExercise.course = findCourse;
                        newExercise.title = data.title
                        newExercise.module = data.module
                        newExercise.pdf = data.pdf
                        newExercise.youtubeLink = data.youtube_link
                        newExercise.description1 = data.description
                        newExercise.description2 = data.description2
                        const createdExercise = await this.exerciseRepository.save(newExercise);
    
                        if(createdExercise){
                            const createTab = new TabEntity();
                            createTab.exercise = createdExercise;
                            createTab.orden = 0;
                            createTab.title = null;
                            const createdTab = await this.tabRepository.save(createTab);
    
                            if(createdTab) {
                                data.exercises.map(async (item,index) => {
                                    const createTask = new TaskEntity();
                                    createTask.tab = createTab;
                                    createTask.orden = index
                                    const createdTask = await this.taskRepository.save(createTask)    
                                    if(createdTask){
                                        const exercise = item.exercise
                                        const propertyName = `exercise${exercise}`;
                                        item[propertyName].data.map(async (subItem) => {
                                            subItem.collectionsCols.map(async (col) => {
                                                const createColumnTask = new ColumnTaskEntity();
                                                createColumnTask.title = col.title
                                                createColumnTask.orden = col.orden
                                                createColumnTask.type = col.type
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
                                                        if(objc.module_type) {
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
                                                        }
                                                    })
                                                }
    
                                            })
                                            
         
    
    
                                        })
                    
                                    }  
                                })
                            }
                        }
                    }
                    
                }
            }
            await this.delay(2000);
        }

        } catch (error) {
            console.error('Error fetching data:', error.message);
            throw error;
        } 
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
}
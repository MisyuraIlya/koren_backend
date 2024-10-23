import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExerciseEntity } from './entities/exercise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { CourseEntity } from 'src/course/entities/course.entity';
import { TaskEntity } from 'src/task/entities/task.entity';
import { TabEntity } from 'src/tab/entities/tab.entity';
import { ColumnTaskEntity } from 'src/column_task/entities/columnTask.entity';
import { RowTaskEntity } from 'src/row_task/entities/rowTask.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { ValueEntity } from 'src/value/entities/value.entity';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';

@Injectable()
export class ExerciseService {

    constructor(
        @InjectRepository(ExerciseEntity)
        private readonly exerciseRepository: Repository<ExerciseEntity>,
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
        @InjectRepository(TabEntity)
        private readonly tabRepository: Repository<TabEntity>,
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(ColumnTaskEntity)
        private readonly columnsTaskRepository: Repository<ColumnTaskEntity>,
        @InjectRepository(RowTaskEntity)
        private readonly rowsTaskRepository: Repository<RowTaskEntity>,
        @InjectRepository(ObjectiveEntity)
        private readonly objectiveRepository: Repository<ObjectiveEntity>,
        @InjectRepository(AnswerEntity)
        private readonly answerRepository: Repository<AnswerEntity>,
        @InjectRepository(ValueEntity)
        private readonly valueRepository: Repository<ValueEntity>,
        @InjectRepository(ExerciseGroupConnection)
        private readonly exerciseGroupConnectionRepository: Repository<ExerciseGroupConnection>,
    ){}

    async create(dto: CreateExerciseDto): Promise<ExerciseEntity>  {
        const findCourse = await this.courseRepository.findOne({
            where:{id:dto.courseId}
        })

        if(!findCourse) throw new BadRequestException('Course not found');
        
        const newExercise = new ExerciseEntity();
        newExercise.course = findCourse;
        newExercise.title = dto.title;
        newExercise.description1 = dto.description1;
        newExercise.description2 = dto.description2;
        newExercise.module = dto.module;
        newExercise.youtubeLink = dto.youtube_link;
        newExercise.pdf = dto.pdf;
        const createdExercise = await this.exerciseRepository.save(newExercise);
        if(createdExercise){
            dto.tabs.forEach(async (tab) => {
                const newTab = new TabEntity();
                newTab.title = tab.title;
                newTab.orden = tab.orden;
                newTab.exercise = createdExercise;
                const createdTab = await this.tabRepository.save(newTab);
                if(createdTab){
                    tab.tasks.forEach(async (task) => {
                        const newTask = new TaskEntity();
                        newTask.orden = task.orden;
                        newTask.specialModuleType = task.specialModuleType;
                        newTask.properties = task.properties;
                        newTask.tab = createdTab
                        const createdTask = await this.taskRepository.save(newTask);
                        if(createdTask){
                            task?.columns?.forEach(async (column) => {
                                const newColumn = new ColumnTaskEntity();
                                newColumn.orden = column.orden;
                                newColumn.title = column.title;
                                newColumn.type = column.type;
                                newColumn.task = createdTask;
                                await this.columnsTaskRepository.save(newColumn);
                            })

                            task?.rows?.forEach(async (row,indexRow) => {
                                const newRow = new RowTaskEntity();
                                newRow.orden = indexRow;
                                newRow.youtubeLink = row.youtubeLink;
                                newRow.pdf = row.pdf;
                                newRow.task = createdTask;
                                const createdRow = await this.rowsTaskRepository.save(newRow);

                                if(createdRow) {
                                    row.objectives.forEach(async (objective) => {
                                        if(objective){
                                            const newObjective = new ObjectiveEntity();
                                            newObjective.orden = objective?.orden;
                                            newObjective.placeholder = objective.placeholder;
                                            newObjective.moduleType = objective.moduleType;
                                            newObjective.isFullText = objective.isFullText;
                                            newObjective.rowTask = createdRow
                                            const createdObjective = await this.objectiveRepository.save(newObjective);
    
                                            if(createdObjective){
                                                objective.answers.forEach(async (answer) => {
                                                    const newAnswer = new AnswerEntity();
                                                    newAnswer.objective = createdObjective
                                                    newAnswer.value = answer.value
                                                    await this.answerRepository.save(newAnswer)
                                                })
    
                                                objective.values.forEach(async (value) => {
                                                    const newValue = new ValueEntity();
                                                    newValue.objective = createdObjective
                                                    newValue.value = value.value
                                                    await this.valueRepository.save(newValue)
                                                })
    
                                            }
                                        }
                      
                                    })
                                }
                            })
                        }
                    })
                }
            })
            return createdExercise;
        } else {
            throw new BadRequestException('cannot create exercise');
        }
    }

    async update(id:number, dto: UpdateExerciseDto): Promise<ExerciseEntity> {
        const findExercise = await this.exerciseRepository.findOne({
            where:{id:id}
        })

        if(!findExercise) throw new BadRequestException('Course not found');

        if (dto.pdf !== undefined) {
            findExercise.pdf = dto.pdf;
        }
      
        if (dto.youtubeLink !== undefined) {
            findExercise.youtubeLink = dto.youtubeLink;
        }

        return this.exerciseRepository.save(findExercise);
    }

    async findOne(id: number): Promise<ExerciseEntity> {
        const exercise = await this.exerciseRepository
        .createQueryBuilder('exercise')
        .leftJoinAndSelect('exercise.course', 'course')
        .leftJoinAndSelect('exercise.pdfs', 'pdfs')
        .leftJoinAndSelect('exercise.tabs', 'tabs')
        .leftJoinAndSelect('tabs.tasks', 'tasks')
        .leftJoinAndSelect('tasks.columns', 'columns')
        .leftJoinAndSelect('tasks.rows', 'rows')
        .leftJoinAndSelect('rows.objectives', 'objectives')
        .leftJoinAndSelect('objectives.answers', 'answers')
        .leftJoinAndSelect('objectives.values', 'values')
        .where('course.id = :id', {id})
        .orderBy('tabs.orden', 'ASC')
        .addOrderBy('pdfs.orden', 'ASC')
        .addOrderBy('tasks.orden', 'ASC')
        .addOrderBy('columns.orden', 'ASC')
        .addOrderBy('rows.orden', 'ASC')
        .addOrderBy('objectives.orden', 'ASC')
        .addOrderBy('values.orden','ASC')
        .getOne();
        return exercise;
    }

    async findOneByStudent(id: number, studentId: number) {
        const query = this.exerciseRepository
        .createQueryBuilder('exercise')
        .leftJoinAndSelect('exercise.course', 'course')
        .leftJoinAndSelect('exercise.pdfs', 'pdfs')
        .leftJoinAndSelect('exercise.tabs', 'tabs')
        .leftJoinAndSelect('tabs.tasks', 'tasks')
        .leftJoinAndSelect('tasks.columns', 'columns')
        .leftJoinAndSelect('tasks.rows', 'rows')
        .leftJoinAndSelect('rows.objectives', 'objectives')
        .leftJoinAndSelect('objectives.answers', 'answers')
        .leftJoinAndSelect('objectives.values', 'values')
        .orderBy('tabs.orden', 'ASC')
        .addOrderBy('pdfs.orden', 'ASC')
        .addOrderBy('tasks.orden', 'ASC')
        .addOrderBy('columns.orden', 'ASC')
        .addOrderBy('rows.orden', 'ASC')
        .addOrderBy('objectives.orden', 'ASC')
        .addOrderBy('values.orden','ASC');

    
    if (studentId) {
        console.log('studentId',studentId)
        query.leftJoinAndSelect('answers.answers', 'studentAnswers', 'studentAnswers.student.id = :studentId', { studentId });
        query.leftJoinAndSelect('exercise.histories', 'history', 'history.student.id = :studentId', { studentId });
    }

    const exercise = await query
        .where('course.id = :id', { id })
        .getOne();

        if(exercise){
            const exerciseId = exercise.id
            const connection = await this.exerciseGroupConnectionRepository
            .createQueryBuilder("egc")
            .leftJoinAndSelect("egc.students", "euc")
            .leftJoinAndSelect('egc.exerciseType',"exerciseType")
            .where("egc.exercise.id = :exerciseId", { exerciseId })
            .andWhere("euc.student.id = :studentId", { studentId })
            .getOne();
        
            return {...exercise, group: connection, userGroup: connection?.students?.[0]};
        } else {
            throw new BadRequestException('not found exercise');
        }

    }

    async remove(id: number): Promise<void> {
        const exercise = await this.exerciseRepository.findOneBy({id})
        if (!exercise) {
            throw new BadRequestException('Exercise not found');
          }

        await this.exerciseRepository.remove(exercise)
    }


}

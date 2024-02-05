import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { CourseEntity } from 'src/course/entities/course.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { StudentAnswer } from 'src/student-answer/entities/student-answer.entity';

@Entity({name: 'student_history'})
export class StudentHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AuthEntity, history => history.histories, {onDelete: "CASCADE"})
    student: AuthEntity;

    @ManyToOne(() => CourseEntity, history => history.histories, {onDelete: "CASCADE"})
    course: CourseEntity;

    @ManyToOne(() => ExerciseEntity, history => history.histories, {onDelete: "CASCADE"})
    exercise: ExerciseEntity;

    @Column()
    grade: number;

    @Column({default:0, name:'total_questions'})
    totalQuestions: number;

    @Column({default:0, name:'total_correct'})
    totalCorrect: number;

    @Column({default:0, name:'total_uncorrect'})
    totalUncorrect: number;

    @Column({default:false, name:'is_done'})
    isDone: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => StudentAnswer, answers => answers.history, { cascade: ["remove"] })
    answers: StudentAnswer[];
  
}

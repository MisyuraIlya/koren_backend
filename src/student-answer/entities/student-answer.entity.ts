import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';

@Entity({name: 'student_answer'})
export class StudentAnswer {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StudentHistory, history => history.answers, {onDelete: "CASCADE"})
    history: StudentHistory;

    @ManyToOne(() => AuthEntity, answer => answer.studentsGroup, {onDelete: "CASCADE"})
    student: AuthEntity;

    @ManyToOne(() => AnswerEntity, history => history.answers, {onDelete: "CASCADE"})
    answer: AnswerEntity;

    @Column({default:false, name:'is_correct'})
    isCorrect: boolean;
    
    @Column({type: 'float', default:0})
    grade: number;

    @Column({type: 'float', default:0})
    gradeToShow: number;

    @Column({nullable:true})
    value: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

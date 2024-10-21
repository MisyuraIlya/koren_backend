import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne } from 'typeorm';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { StudentAnswer } from 'src/student-answer/entities/student-answer.entity';

@Entity({ name: 'answer' })
export class AnswerEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable: true})
    value: string;

    @ManyToOne(() => ObjectiveEntity, row => row.answers, {onDelete: "CASCADE"})
    objective: ObjectiveEntity;

    @OneToMany(() => StudentAnswer, answer => answer.answer, { cascade: ["remove"] })
    answers: StudentAnswer[];

}

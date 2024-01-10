import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
@Entity({ name: 'answer' })
export class AnswerEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable: true})
    value: string;

    @ManyToOne(() => ObjectiveEntity, row => row.answers, {onDelete: "CASCADE"})
    objective: ObjectiveEntity;

}

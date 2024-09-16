import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
@Entity({ name: 'value' })
export class ValueEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable: true})
    value: string;

    @Column({nullable: true})
    orden: number;

    @ManyToOne(() => ObjectiveEntity, row => row.values, {onDelete: "CASCADE"})
    objective: ObjectiveEntity;

}

import { AuthEntity } from "src/auth/entities/auth.entity";
import { ObjectiveEntity } from "src/objective/entities/objective.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'high_light' })
export class HighlightEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column({
        type: 'text',
        nullable: true, 
    })
    value: string;

    @ManyToOne(() => AuthEntity, answer => answer.highlights, {onDelete: "CASCADE"})
    student: AuthEntity;

    @ManyToOne(() => ObjectiveEntity, row => row.highlights, {onDelete: "CASCADE"})
    objective: ObjectiveEntity;

    
}

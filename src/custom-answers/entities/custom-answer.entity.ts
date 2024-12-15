import { AuthEntity } from "src/auth/entities/auth.entity";
import { ObjectiveEntity } from "src/objective/entities/objective.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'custom_answers' })
export class CustomAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    value: string;

    @ManyToOne(() => ObjectiveEntity, row => row.values, {onDelete: "CASCADE"})
    objective: ObjectiveEntity;

    @ManyToOne(() => AuthEntity, answer => answer.customAnswers, {onDelete: "CASCADE"})
    student: AuthEntity;

}

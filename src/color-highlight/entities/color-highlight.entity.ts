import { AuthEntity } from "src/auth/entities/auth.entity";
import { ExerciseEntity } from "src/exercise/entities/exercise.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'color_highlight' })
export class ColorHighlight {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column({
        type: 'text',
        nullable: true, 
    })
    value: string;

    @Column()
    color: string;

    @ManyToOne(() => AuthEntity, answer => answer.highlights, {onDelete: "CASCADE"})
    student: AuthEntity;  

    @ManyToOne(() => ExerciseEntity, row => row.colorHighlights, {onDelete: "CASCADE"})
    exercise: ExerciseEntity;
}

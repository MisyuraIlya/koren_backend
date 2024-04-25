import { ExerciseGroupConnection } from "src/exercise-group-connection/entities/exercise-group-connection.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'exercise_type'})
export class ExerciseType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    title: string

    @Column({ type: 'boolean', default: false })
    isDateable: boolean

    @Column({ type: 'boolean', default: false })
    isTimeable: boolean

    @Column()
    orden: number

    @OneToMany(() => ExerciseGroupConnection, connection => connection.exerciseType, { cascade: ["remove"] })
    connections: ExerciseGroupConnection[];
}

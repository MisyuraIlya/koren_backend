import { ExerciseGroupConnection } from "src/exercise-group-connection/entities/exercise-group-connection.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'semester'})
export class Semester {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    title: string;

    @Column({ type: 'int' }) 
    year: number;

    @Column({ type: 'date', name:'from_date' })
    fromDate: Date;

    @Column({ type: 'date', name:'to_date' })
    toDate: Date;

    @Column({ type: 'boolean', default: false })
    active: boolean;

    @OneToMany(() => ExerciseGroupConnection, connection => connection.semester, { cascade: ["remove"] })
    connections: ExerciseGroupConnection[];
}

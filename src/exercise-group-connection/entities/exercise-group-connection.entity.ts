import { AuthEntity } from "src/auth/entities/auth.entity";
import { ExerciseType } from "src/exercise-type/entities/exercise-type.entity";
import { ExerciseUserConnection } from "src/exercise-user-connection/entities/exercise-user-connection.entity";
import { ExerciseEntity } from "src/exercise/entities/exercise.entity";
import { Group } from "src/group/entities/group.entity";
import { Semester } from "src/semester/entities/semester.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'exercise_group_connection'})
export class ExerciseGroupConnection {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    group: string;

    @ManyToOne(() => ExerciseEntity, exercise => exercise.connections, {onDelete: "CASCADE"})
    exercise: ExerciseEntity;

    @ManyToOne(() => ExerciseType, ExerciseType => ExerciseType.connections, {onDelete: "CASCADE"})
    exerciseType: ExerciseType;

    @ManyToOne(() => AuthEntity, exercise => exercise.teacherConnections, {onDelete: "CASCADE"})
    teacher: AuthEntity;

    @ManyToOne(() => Semester, ExerciseType => ExerciseType.connections, {onDelete: "CASCADE"})
    semester: Semester;

    @Column({ type: 'date', name:'from_date' })
    fromDate: Date;

    @Column({ type: 'date', name:'to_date' })
    toDate: Date;

    @Column({ type: 'date', name:'created_date' })
    createdAt: Date;

    @Column({ type: 'date', name:'updated_date' })
    updatedAt: Date;

    @Column({nullable: true})
    time: string;

    @Column({nullable: true})
    toTime: string;

    @OneToMany(() => ExerciseUserConnection, students => students.connection, { cascade: ["remove"] })
    students: ExerciseUserConnection[];

    @Column({nullable:true})
    answerType: string

    @Column({ type: 'date', name:'answer_date', nullable:true })
    answerDate: Date;

    @Column({nullable: true})
    answerTime: string;
    
    @Column({nullable: true})
    toAnswerTime: string;
}

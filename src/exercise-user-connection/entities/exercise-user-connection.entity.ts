import { AuthEntity } from "src/auth/entities/auth.entity";
import { ExerciseGroupConnection } from "src/exercise-group-connection/entities/exercise-group-connection.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'exercise_user_connection'})
export class ExerciseUserConnection {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExerciseGroupConnection, student => student.students, {onDelete: "CASCADE"})
    connection: ExerciseGroupConnection;

    @ManyToOne(() => AuthEntity, user => user.studentConnections, {onDelete: "CASCADE"})
    student: AuthEntity;

    @Column({ type: 'date', name:'due_date', nullable:true })
    dueDate: Date;

    @Column({nullable: true})
    answerTime: string;

    @Column({nullable: true})
    answerTimeTo: string;


    @Column({name:'is_open_answer'})
    isOpenAnswer: boolean

    @Column({default: false, name:'is_done'})
    isDone: boolean;

    @Column({default: false, name:'is_resend'})
    isResend: boolean;

}

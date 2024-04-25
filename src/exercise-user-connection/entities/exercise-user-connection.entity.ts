import { AuthEntity } from "src/auth/entities/auth.entity";
import { ExerciseGroupConnection } from "src/exercise-group-connection/entities/exercise-group-connection.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'exercise_user_connection'})
export class ExerciseUserConnection {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExerciseGroupConnection, student => student.students, {onDelete: "CASCADE"})
    connection: ExerciseGroupConnection;

    @ManyToOne(() => AuthEntity, user => user.studentConnections, {onDelete: "CASCADE"})
    student: AuthEntity;
}

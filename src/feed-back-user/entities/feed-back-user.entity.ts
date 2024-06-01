import { AuthEntity } from "src/auth/entities/auth.entity";
import { ExerciseUserConnection } from "src/exercise-user-connection/entities/exercise-user-connection.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'feed_back_user' })
export class FeedBackUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => AuthEntity, main => main.feedBacks, {onDelete: "CASCADE"})
    user: AuthEntity;

    @ManyToOne(() => ExerciseUserConnection, main => main.feedBack, {onDelete: "CASCADE"})
    group: ExerciseUserConnection;
    
}
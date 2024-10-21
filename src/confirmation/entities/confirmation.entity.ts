import { IsBoolean } from "class-validator";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { CourseEntity } from "src/course/entities/course.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'confirmation' })
export class Confirmation {

    @PrimaryGeneratedColumn()
    id: number; 

    @IsBoolean()
    isRead: boolean;

    @ManyToOne(() => AuthEntity, confirm => confirm.confirmations, {onDelete: "CASCADE"})
    user: AuthEntity;

    @ManyToOne(() => CourseEntity, confirm => confirm.confirmations, {onDelete: "CASCADE"})
    course: CourseEntity;

}

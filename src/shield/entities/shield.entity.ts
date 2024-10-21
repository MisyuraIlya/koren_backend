import { AuthEntity } from "src/auth/entities/auth.entity";
import { CourseEntity } from "src/course/entities/course.entity";
import { ShieldEnum } from "src/enums/shield.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'shield' })
export class Shield {

    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    grade: number

    @Column({
        type: 'enum',
        enum: ShieldEnum,
    })
    type: ShieldEnum;

    @ManyToOne(() => AuthEntity, user => user.shields, {onDelete: "CASCADE"})
    user: AuthEntity;

    @ManyToOne(() => CourseEntity, course => course.shields, {onDelete: "CASCADE"})
    course: CourseEntity;
}

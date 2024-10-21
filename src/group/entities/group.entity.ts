import { AuthEntity } from "src/auth/entities/auth.entity";
import { Class } from "src/class/entities/class.entity";
import { GroupPrivilageEnum, GroupTypeEnum } from "src/enums/gourpType.enum";
import { ExerciseGroupConnection } from "src/exercise-group-connection/entities/exercise-group-connection.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'group' })
export class Group {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    uuid: string;

    @ManyToOne(() => AuthEntity, auth => auth.studentsGroup, {onDelete: "CASCADE"})
    student: AuthEntity;

    @ManyToOne(() => AuthEntity, auth => auth.teachersGroup, {onDelete: "CASCADE"})
    teacher: AuthEntity;

    @ManyToOne(() => Class, ClassId => ClassId.groups, {onDelete: "CASCADE"})
    class: Class;

    @Column({
        type: 'enum',
        enum: GroupTypeEnum,
        default: GroupTypeEnum.Custom, 
    })
    role: GroupTypeEnum;

    @Column()
    title: string


    @Column({
        type: 'enum',
        enum: GroupPrivilageEnum,
        default: GroupPrivilageEnum.Second, 
    })
    privilage: GroupPrivilageEnum;

}

import { AuthEntity } from "src/auth/entities/auth.entity";
import { Group } from "src/group/entities/group.entity";
import { School } from "src/school/entities/school.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: 'class' })
export class Class {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column({nullable: true, name:'class_ext_id'})
    classExtId: string

    @Column()
    title: string

    @OneToMany(() => Group, group => group.class, { cascade: ["remove"] })
    groups: Group[];

    @OneToMany(() => AuthEntity, student => student.class, { cascade: ["remove"] })
    students: AuthEntity[];

    @ManyToOne(() => School, school => school.classes, {onDelete: "CASCADE"})
    school: School;
}
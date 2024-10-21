import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Class } from "src/class/entities/class.entity";
import { AuthEntity } from "src/auth/entities/auth.entity";
@Entity({ name: 'school' })
export class School {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    title: string

    @OneToMany(() => Class, Class => Class.school, { cascade: ["remove"] }) 
    classes: Class[];

    @OneToMany(() => AuthEntity, auth => auth.school, { cascade: ["remove"] }) 
    users: AuthEntity[];
}
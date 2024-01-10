import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number; 
    
    @Column()
    email: string

    @Column()
    password: string

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    role: string;

    @Column({default: true})
    isActive: boolean;

}
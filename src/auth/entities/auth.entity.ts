import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Role } from "src/enums/role.enum";
@Entity({ name: 'auth' })
export class AuthEntity {
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

    @Column({default: true})
    isActive: boolean;

    @Column({default: false})
    isAdmin: boolean;
    
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.Student, 
    })
    role: Role;
}
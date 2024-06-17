import { AuthEntity } from "src/auth/entities/auth.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'mail'})
export class Mail {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    description: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => AuthEntity, user => user.mailRecive , {onDelete: "CASCADE"})
    userRecive: AuthEntity;

    @ManyToOne(() => AuthEntity, user => user.mailSend , {onDelete: "CASCADE"})
    userSend: AuthEntity;
}

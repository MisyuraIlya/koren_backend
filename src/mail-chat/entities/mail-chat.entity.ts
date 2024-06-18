import { AuthEntity } from "src/auth/entities/auth.entity";
import { Mail } from "src/mail/entities/mail.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'mail_chat'})
export class MailChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    description: string;

    @Column()
    uuid: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @ManyToOne(() => AuthEntity, user => user.chats , {onDelete: "CASCADE"})
    user: AuthEntity;
}

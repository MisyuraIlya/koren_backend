import { AuthEntity } from "src/auth/entities/auth.entity";
import { MailTypeEnum } from "src/enums/mail.enum";
import { ExerciseEntity } from "src/exercise/entities/exercise.entity";
import { MailChat } from "src/mail-chat/entities/mail-chat.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'mail'})
export class Mail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    uuid: string;
  
    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({default: false})
    isRead: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: MailTypeEnum,
        default: MailTypeEnum.Original, 
    })
    type: MailTypeEnum;

    @ManyToOne(() => AuthEntity, user => user.mailRecive , {onDelete: "CASCADE"})
    userRecive: AuthEntity;

    @ManyToOne(() => AuthEntity, user => user.mailSend , {onDelete: "CASCADE"})
    userSend: AuthEntity;

    @ManyToOne(() => ExerciseEntity, exercise => exercise.mail , {onDelete: "CASCADE"})
    exercise: ExerciseEntity;

}

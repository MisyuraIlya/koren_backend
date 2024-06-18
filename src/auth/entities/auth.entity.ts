import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Role } from "src/enums/role.enum";
import { StudentHistory } from "src/student-history/entities/student-history.entity";
import { StudentAnswer } from "src/student-answer/entities/student-answer.entity";
import { Group } from "src/group/entities/group.entity";
import { Class } from "src/class/entities/class.entity";
import { School } from "src/school/entities/school.entity";
import { Confirmation } from "src/confirmation/entities/confirmation.entity";
import { ExerciseGroupConnection } from "src/exercise-group-connection/entities/exercise-group-connection.entity";
import { ExerciseUserConnection } from "src/exercise-user-connection/entities/exercise-user-connection.entity";
import { Mail } from "src/mail/entities/mail.entity";
import { MailChat } from "src/mail-chat/entities/mail-chat.entity";

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

    @OneToMany(() => StudentHistory, history => history.student, { cascade: ["remove"] })
    histories: StudentHistory[];

    @OneToMany(() => StudentAnswer, answer => answer.student, { cascade: ["remove"] })
    answers: StudentAnswer[];

    @OneToMany(() => StudentAnswer, student => student.student, { cascade: ["remove"] })
    studentsGroup: StudentAnswer[];

    @OneToMany(() => Group, teacher => teacher.teacher, { cascade: ["remove"] })
    teachersGroup: StudentAnswer[];

    @ManyToOne(() => Class, classId => classId.students, {onDelete: "CASCADE"})
    class: Class;

    @ManyToOne(() => School, school => school.users, {onDelete: "CASCADE"})
    school: School;

    @OneToMany(() => Confirmation, student => student.user, { cascade: ["remove"] })
    confirmations: Confirmation[];

    @OneToMany(() => ExerciseGroupConnection, connection => connection.teacher, { cascade: ["remove"] })
    teacherConnections: ExerciseGroupConnection[];

    @OneToMany(() => ExerciseUserConnection, connection => connection.student, { cascade: ["remove"] })
    studentConnections: ExerciseUserConnection[];

    @OneToMany(() => Mail, mail => mail.userRecive, {onDelete: "CASCADE"})
    mailRecive: Mail[];

    @OneToMany(() => Mail, mail => mail.userSend, {onDelete: "CASCADE"})
    mailSend: Mail[];

    @OneToMany(() => MailChat, chat => chat.user, {onDelete: "CASCADE"})
    chats: MailChat[];

}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';
import { Confirmation } from 'src/confirmation/entities/confirmation.entity';

@Entity({name: 'course'})
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  grade: string;

  @ManyToOne(() => CourseEntity, course => course.children, {onDelete: "CASCADE"})
  parent: CourseEntity;

  @OneToMany(() => CourseEntity, course => course.parent, { cascade: ["remove"] } )
  children: CourseEntity[];

  @Column({ nullable: true })
  level: number;

  @Column({ nullable: true })
  orden: number;

  @Column({ default: true })
  published: boolean;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true, name:'bg_color' })
  bgColor: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  pdf: string;

  @Column({ nullable: true, name:'youtube_link' })
  youtubeLink: string;

  @Column({ default: false, name:'is_not_in_the_book' })
  isNotInTheBook: boolean;

  @OneToMany(() => ExerciseEntity, exercise => exercise.course, { cascade: ["remove"] })
  exercises: ExerciseEntity[];
  
  @OneToMany(() => StudentHistory, history => history.course, { cascade: ["remove"] })
  histories: StudentHistory[];

  @OneToMany(() => Confirmation, student => student.course, { cascade: ["remove"] })
  confirmations: Confirmation[];

}

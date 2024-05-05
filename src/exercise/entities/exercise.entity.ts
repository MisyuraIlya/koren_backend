import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { TabEntity } from 'src/tab/entities/tab.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';

@Entity({ name: 'exercise' })
export class ExerciseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  title: string;

  @Column({nullable: true})
  description1: string;

  @Column({nullable: true})
  description2: string;

  @Column({nullable: true})
  module: number;

  @Column({nullable: true, name:'youtube_link'})
  youtubeLink: string;

  @Column({nullable: true})
  pdf: string;

  @Column({default:true, name:'is_in_the_book'})
  isInTheBook: boolean;

  @ManyToOne(() => CourseEntity, course => course.exercises, {onDelete: "CASCADE"})
  course: CourseEntity;

  @OneToMany(() => TabEntity, tab => tab.exercise, { cascade: ["remove"] })
  tabs: TabEntity[];

  @OneToMany(() => StudentHistory, history => history.exercise, { cascade: ["remove"] })
  histories: StudentHistory[];

  @OneToMany(() => ExerciseGroupConnection, connection => connection.exercise, { cascade: ["remove"] })
  connections: ExerciseGroupConnection[];

  fullPath: string
}

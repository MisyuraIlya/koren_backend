// exercises-head.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { TaskEntity } from 'src/task/entities/task.entity';

@Entity({ name: 'tab' })
export class TabEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  title: string;

  @Column({nullable: true})
  orden: number;

  @ManyToOne(() => ExerciseEntity, course => course.tabs, {onDelete: "CASCADE"})
  exercise: ExerciseEntity;

  @OneToMany(() => TaskEntity, exercise => exercise.tab, { cascade: ["remove"] })
  tasks: TaskEntity[];

}

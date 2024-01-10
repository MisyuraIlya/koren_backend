import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TaskEntity } from 'src/task/entities/task.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
@Entity({ name: 'row_task' })
export class RowTaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  orden: number;

  @Column({nullable: true, name:'youtube_link'})
  youtubeLink: string;

  @Column({nullable: true})
  pdf: string;
  
  @ManyToOne(() => TaskEntity, row => row.rows, {onDelete: "CASCADE"})
  task: TaskEntity;

  @OneToMany(() => ObjectiveEntity, row => row.rowTask, { cascade: ["remove"] })
  objectives: ObjectiveEntity[];

}
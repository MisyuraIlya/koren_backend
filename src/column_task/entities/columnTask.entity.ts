import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TaskEntity } from 'src/task/entities/task.entity';

@Entity({ name: 'column_task' })
export class ColumnTaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  title: string;

  @Column({type: 'float',nullable: true})
  orden: number;

  @Column({nullable: true})
  type: string;

  @ManyToOne(() => TaskEntity, task => task.columns, {onDelete: "CASCADE"})
  task: TaskEntity;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TabEntity } from 'src/tab/entities/tab.entity';
import { ColumnTaskEntity } from 'src/column_task/entities/columnTask.entity';
import { RowTaskEntity } from 'src/row_task/entities/rowTask.entity';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  orden: number;

  @ManyToOne(() => TabEntity, tab => tab.tasks, {onDelete: "CASCADE"})
  tab: TabEntity;

  @OneToMany(() => ColumnTaskEntity, column => column.task, { cascade: ["remove"] })
  columns: ColumnTaskEntity[];

  @OneToMany(() => RowTaskEntity, row => row.task, { cascade: ["remove"] })
  rows: RowTaskEntity[];
}

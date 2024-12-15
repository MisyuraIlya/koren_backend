import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RowTaskEntity } from 'src/row_task/entities/rowTask.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { ValueEntity } from 'src/value/entities/value.entity';
import { CustomAnswer } from 'src/custom-answers/entities/custom-answer.entity';

@Entity({ name: 'objective' })
export class ObjectiveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  placeholder: string;

  @Column({name:'module_type',nullable: true })
  moduleType: string;

  @Column({type: 'float',nullable: true})
  orden: number;

  @Column({nullable: true, name:'is_full_text'})
  isFullText: boolean;

  @ManyToOne(() => RowTaskEntity, row => row.objectives, {onDelete: "CASCADE"})
  rowTask: RowTaskEntity;

  @OneToMany(() => AnswerEntity, answer => answer.objective, { cascade: ["remove"] })
  answers: AnswerEntity[];

  @OneToMany(() => ValueEntity, value => value.objective, { cascade: ["remove"] })
  values: ValueEntity[];

  @OneToMany(() => CustomAnswer, value => value.objective, { cascade: ["remove"] })
  customAnswers: CustomAnswer[];

}
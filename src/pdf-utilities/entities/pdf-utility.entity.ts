import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
@Entity({name: 'pdf_utilities'})
export class PdfUtilitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  pdf: string;

  @Column({ nullable: true })
  orden: number;

  @ManyToOne(() => ExerciseEntity, course => course.pdfs, {onDelete: "CASCADE"})
  exercise: ExerciseEntity;
  
}

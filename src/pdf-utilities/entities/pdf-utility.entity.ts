import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
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

  @ManyToOne(() => CourseEntity, course => course.pdfUtilities, {onDelete: "CASCADE"})
  course: CourseEntity;
  
}

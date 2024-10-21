import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseEntity } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
    ) {}

    async create(dto: CreateCourseDto) {
        const parent = await this.courseRepository.findOne({
            where:{id:dto.parentId}
        })
        const newCourse = new CourseEntity();
        newCourse.name = dto.name
        newCourse.level = dto.level
        if(parent && dto.parentId){
            newCourse.parent = parent
        }
        const save = await this.courseRepository.save(newCourse);
        return save
    }

    findAll(userId: string): Promise<CourseEntity[]> {
      return this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.children', 'childrenLvl1')
      .leftJoinAndSelect('childrenLvl1.children', 'childrenLvl2')
      .leftJoinAndSelect('childrenLvl2.children', 'childrenLvl3')
      .leftJoinAndSelect('childrenLvl3.children', 'childrenLvl4')
      .leftJoinAndSelect('childrenLvl4.children', 'childrenLvl5')
      .leftJoinAndSelect('childrenLvl3.confirmations', 'confirmation', 'confirmation.user.id = :userId')
      .where('course.level = 1')
      .setParameter('userId', userId)
      .orderBy('course.orden', 'ASC')
      .addOrderBy('childrenLvl1.orden', 'ASC')
      .addOrderBy('childrenLvl2.orden', 'ASC')
      .addOrderBy('childrenLvl3.orden', 'ASC')
      .addOrderBy('childrenLvl4.orden', 'ASC')
      .addOrderBy('childrenLvl5.orden', 'ASC')
      .getMany();
      
    }

    async remove(id: number) {
        const course = await this.courseRepository.findOneBy({id})
        console.log('course',id)
        if (!course) {
            throw new BadRequestException('Exercise not found');
          }

        await this.courseRepository.remove(course)
    }

    async sortable(dto: CourseEntity[]): Promise<void> {
        for (const course of dto) {
          const existingCourse = await this.courseRepository.findOne({
            where:{id:course.id}
          });
          if (existingCourse) {
            existingCourse.orden = course.orden;
            await this.courseRepository.save(existingCourse);
          }
        }
    }

    async update(id: number, updateDto: UpdateCourseDto): Promise<CourseEntity> {
        const course = await this.courseRepository.findOne({
            where:{id:id}
        });
        console.log('id',id,updateDto.isNotInTheBook)
        if (!course) {
          throw new BadRequestException('Course not found');
        }

        if (updateDto.name !== undefined) {
          course.name = updateDto.name;
        }
    
        if (updateDto.level !== undefined) {
          course.level = updateDto.level;
        }
    
        if (updateDto.orden !== undefined) {
          course.orden = updateDto.orden;
        }

        if (updateDto.pdf !== undefined) {
            course.pdf = updateDto.pdf;
        }

        if (updateDto.isNotInTheBook !== undefined) {
          course.isNotInTheBook = updateDto.isNotInTheBook;
        }
    
        return this.courseRepository.save(course);
      }
}

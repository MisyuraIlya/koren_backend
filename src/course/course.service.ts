import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseEntity } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
    ) {}

    create(createTaskDto: CreateCourseDto) {
        return 'This action adds a new task';
    }

    findAll(): Promise<CourseEntity[]> {
        return this.courseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.children', 'childrenLvl1')
        .leftJoinAndSelect('childrenLvl1.children', 'childrenLvl2')
        .leftJoinAndSelect('childrenLvl2.children', 'childrenLvl3')
        .leftJoinAndSelect('childrenLvl3.children', 'childrenLvl4')
        .leftJoinAndSelect('childrenLvl4.children', 'childrenLvl5')
        .where('course.level = 1')
        .orderBy('course.id', 'ASC')
        .getMany()
    }

    async remove(id: number) {
        const course = await this.courseRepository.findOneBy({id})

        if (!course) {
            throw new BadRequestException('Exercise not found');
          }

        await this.courseRepository.remove(course)
    }
}

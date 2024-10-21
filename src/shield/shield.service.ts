import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShieldDto } from './dto/create-shield.dto';
import { UpdateShieldDto } from './dto/update-shield.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { CourseEntity } from 'src/course/entities/course.entity';
import { Shield } from './entities/shield.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShieldService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(Shield)
    private readonly shieldRepository: Repository<Shield>,
){}


  async create(dto: CreateShieldDto) {
    const auth = await this.authRepository.findOne({
      where:{id:dto.userId}
    })

    if(!auth) throw new BadRequestException('no user found');

    const course = await this.courseRepository.findOne({
      where:{id:dto.courseId}
    })

    if(!course) throw new BadRequestException('no course found')

    let shield = await this.shieldRepository.findOne({
      where:{ user: auth, course:course, type: dto.type }
    })
    
    if(!shield){
      shield = new Shield();
      shield.course = course
      shield.user = auth
      shield.type = dto.type

    }
    shield.grade = dto.grade
    this.shieldRepository.save(shield)
    return shield;
  }

  findAll() {
    return `This action returns all shield`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shield`;
  }

  update(id: number, updateShieldDto: UpdateShieldDto) {
    return `This action updates a #${id} shield`;
  }

  remove(id: number) {
    return `This action removes a #${id} shield`;
  }
}

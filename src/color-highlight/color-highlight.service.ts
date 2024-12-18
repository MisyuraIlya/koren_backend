import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateColorHighlightDto } from './dto/create-color-highlight.dto';
import { UpdateColorHighlightDto } from './dto/update-color-highlight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorHighlight } from './entities/color-highlight.entity';
import { Repository } from 'typeorm';
import { ExerciseEntity } from 'src/exercise/entities/exercise.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Injectable()
export class ColorHighlightService {
  constructor(
    @InjectRepository(ColorHighlight)
    private readonly highlightRepository: Repository<ColorHighlight>,
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ){}

  async create(userId: number, exerciseId: number,createColorHighlightDto: CreateColorHighlightDto) {
    const user = await this.authRepository.findOne({
      where:{id:userId}
    })

    if (!user) throw new BadRequestException('user not found');

    const exercise = await this.exerciseRepository.findOne({
      where:{id:exerciseId}
    })

    if (!exercise) throw new BadRequestException('exercise not found');
    
    let hi = await this.highlightRepository.findOne({
      where:{
        color: createColorHighlightDto.color,
        exercise: exercise,
        student: user
      }
    })

    if(!hi){
      hi = new ColorHighlight()
      hi.color = createColorHighlightDto.color,
      hi.exercise = exercise
      hi.student = user
    }
    hi.value = createColorHighlightDto.value
    return this.highlightRepository.save(hi)

  }

  findAll() {
    return `This action returns all colorHighlight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} colorHighlight`;
  }

  update(id: number, updateColorHighlightDto: UpdateColorHighlightDto) {
    return `This action updates a #${id} colorHighlight`;
  }

  remove(id: number) {
    return `This action removes a #${id} colorHighlight`;
  }
}

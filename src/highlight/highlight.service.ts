import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HighlightEntity } from './entities/highlight.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Injectable()
export class HighlightService {
  constructor(
    @InjectRepository(HighlightEntity)
    private readonly highlightRepository: Repository<HighlightEntity>,
    @InjectRepository(ObjectiveEntity)
    private readonly objectiveRepository: Repository<ObjectiveEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ){}

  async create(userId: number, objectiveId: number, createHighlightDto: CreateHighlightDto) {
    const user = await this.authRepository.findOne({
      where:{id:userId}
    })

    if (!user) throw new BadRequestException('user not found');

    const objective = await this.objectiveRepository.findOne({
      where:{id:objectiveId}
    })

    if (!objective) throw new BadRequestException('objective not found');

    let hightLight = await this.highlightRepository.findOne({
      where:{objective:objective,student:user}
    })

    if(!hightLight){
      hightLight = new HighlightEntity()
      hightLight.objective = objective
      hightLight.student = user
    }
    hightLight.value = createHighlightDto.value
    return this.highlightRepository.save(hightLight)
  }
}

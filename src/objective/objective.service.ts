import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectiveEntity } from './entities/objective.entity';
import { Repository } from 'typeorm';
import { ValueEntity } from 'src/value/entities/value.entity';

@Injectable()
export class ObjectiveService {
    constructor(
        @InjectRepository(ObjectiveEntity)
        private readonly objectiveRepository: Repository<ObjectiveEntity>,
        @InjectRepository(ValueEntity)
        private readonly valueRepository: Repository<ValueEntity>,
    ){}

    async MediaCreate(id: number, dto:{media:string}) {
        const objective = await this.objectiveRepository.findOneBy({id})
        if (!objective) {
            throw new BadRequestException('objective not found');
        }

        const findAnyValue = await this.valueRepository.find({
            where:{objective: objective}
        })

        if(findAnyValue.length > 0) {
            const value = findAnyValue[0]
            value.value = dto.media
            this.valueRepository.save(value)
            return value
        } else {
            const newValue = new ValueEntity();
            newValue.value = dto.media
            newValue.objective = objective
            this.valueRepository.save(newValue)
            return newValue
        }
        
    }
}

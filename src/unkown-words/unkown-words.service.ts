import { Injectable } from '@nestjs/common';
import { CreateUnkownWordDto } from './dto/create-unkown-word.dto';
import { UpdateUnkownWordDto } from './dto/update-unkown-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnkownWord } from './entities/unkown-word.entity';

@Injectable()
export class UnkownWordsService {
  constructor(
      @InjectRepository(UnkownWord)
      private readonly unkownWordRepository: Repository<UnkownWord>,
  ) {}

  create(createUnkownWordDto: CreateUnkownWordDto) {
    return 'This action adds a new unkownWord';
  }

  findAll() {
    return this.unkownWordRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} unkownWord`;
  }

  update(id: number, updateUnkownWordDto: UpdateUnkownWordDto) {
    return `This action updates a #${id} unkownWord`;
  }

  remove(id: number) {
    return `This action removes a #${id} unkownWord`;
  }
}

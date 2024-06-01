import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedBackUserDto } from './dto/create-feed-back-user.dto';
import { UpdateFeedBackUserDto } from './dto/update-feed-back-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedBackUser } from './entities/feed-back-user.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ExerciseGroupConnection } from 'src/exercise-group-connection/entities/exercise-group-connection.entity';
import { ExerciseUserConnection } from 'src/exercise-user-connection/entities/exercise-user-connection.entity';

@Injectable()
export class FeedBackUserService {
  constructor(
    @InjectRepository(FeedBackUser)
    private readonly feedBackUserRepository: Repository<FeedBackUser>,
    @InjectRepository(AuthEntity)
    private readonly authRepositroy: Repository<AuthEntity>,
    @InjectRepository(ExerciseUserConnection)
    private readonly exerciseUserConnectionRepository: Repository<ExerciseUserConnection>,
    @InjectRepository(ExerciseGroupConnection)
    private readonly exerciseGroupConnectionRepository: Repository<ExerciseGroupConnection>,
    
){}

  async create(createFeedBackUserDto: CreateFeedBackUserDto) {
    const findUser = await this.authRepositroy.findOne({
      where:{id:createFeedBackUserDto.user.id}
    })

    if(!findUser) new BadRequestException('user not found');

    const findGroup = await this.exerciseGroupConnectionRepository.find({
      where:{group:createFeedBackUserDto.uuid}
    })

    if(!findGroup) new BadRequestException('group not found');

    const findGroupConnection = await this.exerciseUserConnectionRepository.findOne({
      where:{student: findUser, connection:findGroup}
    })

    if(!findGroupConnection) new BadRequestException('group user not found');
    
    let obj = await this.feedBackUserRepository.findOne({
      where:{ user: findUser, group: findGroupConnection}
    })
    if(!obj) {
      obj = new FeedBackUser()
      obj.user = findUser
      obj.group = findGroupConnection
    }
    obj.title = createFeedBackUserDto.title
    return this.feedBackUserRepository.save(obj);
  }

  findAll() {
    return `This action returns all feedBackUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedBackUser`;
  }

  update(id: number, updateFeedBackUserDto: UpdateFeedBackUserDto) {
    return `This action updates a #${id} feedBackUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedBackUser`;
  }
}

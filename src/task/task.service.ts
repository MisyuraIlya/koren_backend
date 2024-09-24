import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HandleTaskDto } from './dto/handle-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ){}
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async handleOrder(dto: HandleTaskDto) {
    const find = await this.taskRepository.findOne({
      where:{id:dto.task.id}
    })
    if(find){
      find.orden = dto.orden
      this.taskRepository.save(find);
    }
    return find
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { UpdateStudentAnswerDto } from './dto/update-student-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAnswer } from './entities/student-answer.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { AnswerEntity } from 'src/answer/entities/answer.entity';
import { StudentHistory } from 'src/student-history/entities/student-history.entity';
import { ObjectiveEntity } from 'src/objective/entities/objective.entity';
import { CreateStudentAnswerSpeicalDto } from './dto/create-student-answer-special.dto';
import { CustomAnswer } from 'src/custom-answers/entities/custom-answer.entity';

@Injectable()
export class StudentAnswerService {
  constructor(
    @InjectRepository(StudentAnswer)
    private readonly studentAnswerRepository: Repository<StudentAnswer>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(StudentHistory)
    private readonly studentHistoryRepository: Repository<StudentHistory>,
    @InjectRepository(ObjectiveEntity)
    private readonly ObjectiveRepository: Repository<ObjectiveEntity>,
    @InjectRepository(CustomAnswer)
    private readonly customRepository: Repository<CustomAnswer>,
  ){}

  async handleAnswer(id:number, studentId: number, historyId: number, createStudentAnswerDto: CreateStudentAnswerDto) {
    const user = await this.authRepository.findOne({
      where: {id: studentId}
    })

    if (!user) throw new BadRequestException('user not found');
    
    if(createStudentAnswerDto.moduleType == 'bank'){
      this.handleDragAndDrop(user,id,studentId,historyId,createStudentAnswerDto)
      
  
    } else if(createStudentAnswerDto.moduleType == 'openQuestion' || createStudentAnswerDto.moduleType == 'openQuestion' || createStudentAnswerDto.moduleType == 'openQuestionHamarot') {
      this.handleOpenQuestion(user,id,studentId,historyId,createStudentAnswerDto)
      
    } else {
      const answerExercise = await this.answerRepository.findOne({
        where:{id:id},
        relations:['objective']
      })
  
      if (!answerExercise) throw new BadRequestException('answerExercise not found');
  
      const history = await this.studentHistoryRepository.findOne({
        where: {id: historyId},
        relations:['exercise']
      })
  
      if (!history) throw new BadRequestException('history not found');
  
      let answer = await this.studentAnswerRepository.findOne({
        where:{student: user, answer: answerExercise}
      })
  
      if(!answer){
        answer = new StudentAnswer();
        answer.createdAt = new Date();
        answer.student = user,
        answer.answer = answerExercise
        answer.history = history
      }
      answer.value = createStudentAnswerDto.value.trim()
      answer.updatedAt = new Date();
      let isCorrect = this.CheckIsCorrect(answerExercise,createStudentAnswerDto)
      console.log('isCorrect',isCorrect)
      answer.isCorrect = isCorrect
      this.studentAnswerRepository.save(answer);
      return {status:"success"}
    }

    
  }

  async handleSpecialInput(studentId: number, historyId: number, createStudentAnswerDto: CreateStudentAnswerSpeicalDto) {
    const user = await this.authRepository.findOne({
      where: {id: studentId}
    });
    if (!user) throw new BadRequestException('user not found');
    
    const history = await this.studentHistoryRepository.findOne({
      where: {id: historyId},
      relations:['exercise']
    });
  
    if (!history) throw new BadRequestException('history not found');
  
    let shouldUpdate = false; 
    let startIndex = 0; 
    
    createStudentAnswerDto.objectives?.forEach(async (element, index) => {
      const objective = await this.ObjectiveRepository.findOne({
        where:{id: element.id}
      });
  
      let obj: CustomAnswer;
  
      if (createStudentAnswerDto.objectiveId === element.id) {
        shouldUpdate = true;
        startIndex = index; 
      }
  
      if (shouldUpdate && index >= startIndex) {
        if (element.customAnswers.length > 0) {
          console.log('here');
          obj = await this.customRepository.findOne({
            where: {id: element.customAnswers[0].id},
          });
        } else {
          console.log('here2');
          obj = new CustomAnswer();
          obj.objective = objective;
        }
        
        obj.value = createStudentAnswerDto.value; 
        await this.customRepository.save(obj); 
      }
    });
  
    return { status: "success" };
  }

  findAll() {
    return `This action returns all studentAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentAnswer`;
  }

  update(id: number, updateStudentAnswerDto: UpdateStudentAnswerDto) {
    return `This action updates a #${id} studentAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentAnswer`;
  }

  private CheckIsCorrect(answerExercise: AnswerEntity,createStudentAnswerDto:CreateStudentAnswerDto):boolean {
  
    if(answerExercise.objective.moduleType === 'checkBox'){
        const valuesDto = createStudentAnswerDto.value?.split(';')
        const valuesAnswer = answerExercise.value?.split(';')
        const allIncluded = valuesAnswer.every(value => valuesDto.includes(value.trim()));
        return allIncluded && valuesAnswer.length == valuesDto.length
    } else if(answerExercise.objective.moduleType === 'inputCentered'){
      if(answerExercise.value === 'E' && !createStudentAnswerDto.value){
        return true
      } else if(createStudentAnswerDto.value) {
        const answers = answerExercise.value.split(',').map(item => item.trim());
        return answers.some(answer => answer === createStudentAnswerDto.value.trim());
    } else {
        return false
      }
    } else {
      if (createStudentAnswerDto.value.trim()) {
          return answerExercise.value.includes(createStudentAnswerDto.value.trim());
      } else if(answerExercise.value === 'E'){
        return true;
      } else {
          return false;  // or handle the case where the value is empty
      }
    }

  }

  private async handleDragAndDrop(user: AuthEntity,id:number,studentId:number,historyId:number,createStudentAnswerDto:CreateStudentAnswerDto){
    let objective = await this.ObjectiveRepository.findOne({
      where: {id:id},
      relations:['answers']
    })
    if(objective?.answers.length === 0){
      const newAnswer = new AnswerEntity()
      newAnswer.objective = objective
      newAnswer.value = ''
      await this.answerRepository.save(newAnswer)

      const history = await this.studentHistoryRepository.findOne({
        where: {id: historyId},
        relations:['exercise']
      })
  
      if (!history) throw new BadRequestException('history not found');


      let answer = await this.studentAnswerRepository.findOne({
        where:{student: user, answer: newAnswer}
      })
      if(!answer){
        answer = new StudentAnswer();
        answer.createdAt = new Date();
        answer.student = user,
        answer.answer = newAnswer
        answer.history = history
      }
      answer.value = createStudentAnswerDto.value
      answer.updatedAt = new Date();
      answer.isCorrect = createStudentAnswerDto.isCorrect
      return this.studentAnswerRepository.save(answer);

    } else {
      const newAnswer = await this.answerRepository.findOne({
        where:{id:objective?.answers[0]?.id}
      })


      const history = await this.studentHistoryRepository.findOne({
        where: {id: historyId},
        relations:['exercise']
      })
  
      if (!history) throw new BadRequestException('history not found');


      let answer = await this.studentAnswerRepository.findOne({
        where:{student: user, answer: newAnswer}
      })
      if(!answer){
        answer = new StudentAnswer();
        answer.createdAt = new Date();
        answer.student = user,
        answer.answer = newAnswer
        answer.history = history
      }
      
      answer.value = createStudentAnswerDto.value
      answer.updatedAt = new Date();
      answer.isCorrect = createStudentAnswerDto.isCorrect
      return this.studentAnswerRepository.save(answer);

    }

  }

  private async handleOpenQuestion(user: AuthEntity,id:number,studentId:number,historyId:number,createStudentAnswerDto:CreateStudentAnswerDto){
    let objective = await this.ObjectiveRepository.findOne({
      where: {id:id},
      relations:['answers']
    })
    if(objective?.answers.length === 0){
      const newAnswer = new AnswerEntity()
      newAnswer.objective = objective
      newAnswer.value = ''
      await this.answerRepository.save(newAnswer)

      const history = await this.studentHistoryRepository.findOne({
        where: {id: historyId},
        relations:['exercise']
      })
  
      if (!history) throw new BadRequestException('history not found');


      let answer = await this.studentAnswerRepository.findOne({
        where:{student: user, answer: newAnswer}
      })
      if(!answer){
        answer = new StudentAnswer();
        answer.createdAt = new Date();
        answer.student = user,
        answer.answer = newAnswer
        answer.history = history
      }
      answer.value = createStudentAnswerDto.value
      answer.updatedAt = new Date();
      answer.isCorrect = createStudentAnswerDto.isCorrect
      return this.studentAnswerRepository.save(answer);

    } else {
      const newAnswer = await this.answerRepository.findOne({
        where:{id:objective?.answers[0]?.id}
      })


      const history = await this.studentHistoryRepository.findOne({
        where: {id: historyId},
        relations:['exercise']
      })
  
      if (!history) throw new BadRequestException('history not found');


      let answer = await this.studentAnswerRepository.findOne({
        where:{student: user, answer: newAnswer}
      })
      if(!answer){
        answer = new StudentAnswer();
        answer.createdAt = new Date();
        answer.student = user,
        answer.answer = newAnswer
        answer.history = history
      }
      answer.value = createStudentAnswerDto.value
      answer.updatedAt = new Date();
      answer.isCorrect = createStudentAnswerDto.isCorrect
      return this.studentAnswerRepository.save(answer);

    }
  }

}

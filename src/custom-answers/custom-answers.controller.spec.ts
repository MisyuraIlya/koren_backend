import { Test, TestingModule } from '@nestjs/testing';
import { CustomAnswersController } from './custom-answers.controller';
import { CustomAnswersService } from './custom-answers.service';

describe('CustomAnswersController', () => {
  let controller: CustomAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomAnswersController],
      providers: [CustomAnswersService],
    }).compile();

    controller = module.get<CustomAnswersController>(CustomAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

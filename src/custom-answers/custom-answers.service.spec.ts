import { Test, TestingModule } from '@nestjs/testing';
import { CustomAnswersService } from './custom-answers.service';

describe('CustomAnswersService', () => {
  let service: CustomAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomAnswersService],
    }).compile();

    service = module.get<CustomAnswersService>(CustomAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

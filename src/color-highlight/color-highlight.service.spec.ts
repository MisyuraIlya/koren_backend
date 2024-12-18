import { Test, TestingModule } from '@nestjs/testing';
import { ColorHighlightService } from './color-highlight.service';

describe('ColorHighlightService', () => {
  let service: ColorHighlightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorHighlightService],
    }).compile();

    service = module.get<ColorHighlightService>(ColorHighlightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

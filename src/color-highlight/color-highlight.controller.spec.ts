import { Test, TestingModule } from '@nestjs/testing';
import { ColorHighlightController } from './color-highlight.controller';
import { ColorHighlightService } from './color-highlight.service';

describe('ColorHighlightController', () => {
  let controller: ColorHighlightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorHighlightController],
      providers: [ColorHighlightService],
    }).compile();

    controller = module.get<ColorHighlightController>(ColorHighlightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

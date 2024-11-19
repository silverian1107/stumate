import { Test, TestingModule } from '@nestjs/testing';
import { SrsController } from './srs.controller';
import { SrsService } from './srs.service';

describe('SrsController', () => {
  let controller: SrsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SrsController],
      providers: [SrsService],
    }).compile();

    controller = module.get<SrsController>(SrsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

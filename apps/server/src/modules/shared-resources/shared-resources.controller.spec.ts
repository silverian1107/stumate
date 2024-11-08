import { Test, TestingModule } from '@nestjs/testing';
import { SharedResourcesController } from './shared-resources.controller';
import { SharedResourcesService } from './shared-resources.service';

describe('SharedResourcesController', () => {
  let controller: SharedResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedResourcesController],
      providers: [SharedResourcesService],
    }).compile();

    controller = module.get<SharedResourcesController>(SharedResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

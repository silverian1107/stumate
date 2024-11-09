import { Test, TestingModule } from '@nestjs/testing';
import { SharedResourcesService } from './shared-resources.service';

describe('SharedResourcesService', () => {
  let service: SharedResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedResourcesService],
    }).compile();

    service = module.get<SharedResourcesService>(SharedResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

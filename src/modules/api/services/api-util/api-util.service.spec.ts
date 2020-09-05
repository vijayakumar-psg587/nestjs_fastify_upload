import { Test, TestingModule } from '@nestjs/testing';
import { ApiUtilService } from './api-util.service';

describe('ApiUtilService', () => {
  let service: ApiUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiUtilService],
    }).compile();

    service = module.get<ApiUtilService>(ApiUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

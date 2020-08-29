import { Test, TestingModule } from '@nestjs/testing';
import { RuleFileService } from './rule-file.service';

describe('RuleFileService', () => {
  let service: RuleFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleFileService],
    }).compile();

    service = module.get<RuleFileService>(RuleFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

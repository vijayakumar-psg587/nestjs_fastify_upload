import { Test, TestingModule } from '@nestjs/testing';
import { RuleController } from './rule.controller';

describe('Rule Controller', () => {
  let controller: RuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleController],
    }).compile();

    controller = module.get<RuleController>(RuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

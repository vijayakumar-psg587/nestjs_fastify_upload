import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConnService } from './database-conn.service';

describe('DatabaseConnService', () => {
  let service: DatabaseConnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseConnService],
    }).compile();

    service = module.get<DatabaseConnService>(DatabaseConnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

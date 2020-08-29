import { Module } from '@nestjs/common';
import { HealthCheckController } from './controller/health-check/health-check.controller';
import { HealthCheckService } from './service/healh-check/health-check.service';

@Module({
  controllers: [HealthCheckController],
  providers: [HealthCheckService]
})
export class TerminusModule {}

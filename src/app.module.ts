import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules/api/api.module';
import { LogModule } from './modules/log/log.module';
import { DatabaseModule } from './modules/database/database.module';
import { TerminusModule } from './modules/terminus/terminus.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [ApiModule, LogModule, DatabaseModule, TerminusModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

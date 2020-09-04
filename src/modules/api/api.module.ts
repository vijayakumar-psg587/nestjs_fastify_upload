import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { RuleController } from './controllers/rule/rule.controller';
import {DatabaseModule} from "../database/database.module";
import {SharedModule} from "../shared/shared.module";
import {LogModule} from "../log/log.module";
import { RuleFileService } from './services/rule-file/rule-file.service';

@Module({
  controllers: [RuleController],
  imports: [DatabaseModule, SharedModule, LogModule],
  providers: [RuleFileService]
})
export class ApiModule{

}

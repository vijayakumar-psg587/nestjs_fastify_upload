import {forwardRef, Module} from '@nestjs/common';
import { DatabaseConnService } from './services/database-conn/database-conn.service';
import {SharedModule} from "../shared/shared.module";

@Module({
  providers: [DatabaseConnService],
  exports: [DatabaseConnService],
  imports: [forwardRef(() => SharedModule)]
})
export class DatabaseModule {}

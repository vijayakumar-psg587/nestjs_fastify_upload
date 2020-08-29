import {forwardRef, Module} from '@nestjs/common';
import {AppUtilService} from "./services/app-util.service";
import {AppConfigService} from "./services/app-config.service";
import {CustomExceptionFilter} from "./filters/custom-exception.filter";
import {CorsInterceptor} from "./interceptors/cors.interceptor";
import {ReqHeaderInterceptor} from "../api/interceptors/validators/req-header.interceptor";
import { RetryService } from './services/retry/retry.service';
import {DatabaseModule} from "../database/database.module";

@Module({
    providers: [AppUtilService, AppConfigService, CorsInterceptor, ReqHeaderInterceptor, RetryService],
    imports: [forwardRef(() => DatabaseModule)],
    exports:[AppUtilService, AppConfigService, CorsInterceptor, ReqHeaderInterceptor, RetryService]
})
export class SharedModule {}

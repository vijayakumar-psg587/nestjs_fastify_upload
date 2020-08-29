import {CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope} from '@nestjs/common';
import {Observable, of, throwError} from 'rxjs';
import {DatabaseConnService} from "../../database/services/database-conn/database-conn.service";
import {AppConfigService} from "../../shared/services/app-config.service";
import {RetryService} from "../../shared/services/retry/retry.service";
import {switchMap, tap} from "rxjs/operators";

@Injectable({
  scope: Scope.DEFAULT
})
export class DatabaseInterceptor implements NestInterceptor {

  constructor(private readonly databaseConn: DatabaseConnService,
              private readonly retryService: RetryService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // make sure that the connection is created before the call
    console.log('coming in interceptor');
    try {

      const connection = await this.databaseConn.getDatabaseConnectionAfterImplicitRetries();
      // const connObs = await this.databaseConn.getConnectionAsObs();
      // // @ts-ignore
      // this.retryService.retryConnection(connObs).subscribe(data => {
      //   console.log('data');
      //
      // }, err => {
      //   console.log('in interceptor:',err);
      //   // throw the error here
      //  throw err;
      //
      // });

    } catch (e) {
      console.log('err in connecting to database');
      throw AppConfigService.getCustomError('FID-DB', `Cannot create connection to db - ${e.message}`);
    }
    return next.handle();

  }
}

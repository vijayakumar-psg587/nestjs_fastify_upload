import {forwardRef, Inject, Injectable, Scope} from '@nestjs/common';
import {iif, Observable, of, throwError} from "rxjs";
import {catchError, concatMap, delay, mergeMap, retryWhen, switchMap, tap} from "rxjs/operators";
import {DatabaseConfigModel} from "../../../database/models/database-config.model";
import {DatabaseConnService} from "../../../database/services/database-conn/database-conn.service";
import {AppConfigService} from "../app-config.service";
@Injectable({
    scope: Scope.DEFAULT
})
export class RetryService {
    private databaseConfigModel: DatabaseConfigModel;
    constructor(@Inject(forwardRef(() => DatabaseConnService)) private readonly databaseService: DatabaseConnService) {
        this.databaseConfigModel = this.databaseService.getDatabaseConfig();
    }

    retryConnection(obs: Observable<any>) {
        console.log('database config model:', this.databaseConfigModel);
        return obs.pipe(tap(data=> {
        }), retryWhen(errObs => {
            // console.log('errObs:', errObs);
            return errObs.pipe(tap(err => {
                // console.log('tap in err obs:', err);
            }), concatMap((errData, itr) => {
               return iif(() => itr < this.databaseConfigModel.retires,
                   of(AppConfigService.getCustomError('FID-DB', errData)).pipe(tap(data => {

                       itr = itr +1;
                   }), delay(this.databaseConfigModel.retryDelay*itr*1000)),
                   throwError(AppConfigService.getCustomError('FID-DB', errData))
               );
            }))
        }))
    }
}

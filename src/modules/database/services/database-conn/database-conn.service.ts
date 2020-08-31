import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { DatabaseConfigModel } from '../../models/database-config.model';
import { DatabaseConfigModelBuilder } from '../../models/builder/database-config-model.builder';
import { APP_CONSTANTS } from '../../../shared/util/app-constants';
import { DatabaseTypeEnum } from '../../models/enums/database-type.enum';
import { createConnection, Connection } from 'typeorm';
import atob = require('atob');
import { BehaviorSubject, Observable } from 'rxjs';
import { RetryService } from '../../../shared/services/retry/retry.service';
import { take } from 'rxjs/operators';
import { AppUtilService } from '../../../shared/services/app-util.service';
import {getConnection} from "typeorm/index";

@Injectable({
    scope: Scope.DEFAULT,
})
export class DatabaseConnService {
    private databaseConfigModel = new DatabaseConfigModel();
    private databaseConnSubject: BehaviorSubject<Connection>;
    private dbConn: Connection;
    constructor(@Inject(forwardRef(() => RetryService)) private readonly retryService: RetryService) {
        this.databaseConfigModel = this.getDatabaseConfig();
        this.databaseConnSubject = new BehaviorSubject<Connection>(null);
    }

    getDatabaseConfig(): DatabaseConfigModel {
        const databaseModelBuilder = new DatabaseConfigModelBuilder();
        return databaseModelBuilder
            .setConnectionName(APP_CONSTANTS.DATABASE.CONNECTION.NAME)
            .setType(DatabaseTypeEnum.POSTGRES)
            .setUser(process.env.TYPEORM_USERNAME)
            .setPassword(atob(process.env.TYPEORM_PASSWORD))
            .setPort(process.env.TYPEORM_PORT)
            .setHost(process.env.TYPEORM_HOST)
            .setRetries(process.env.TYPEORM_RETRIES)
            .setRetryDelay(process.env.TYPEORM_RETRY_DELAY)
            .isSynchronize(process.env.TYPEORM_SYNC === 'true')
            .build();
    }

    async createPostgresConnection(): Promise<Connection> {
        return await createConnection({
            name: APP_CONSTANTS.DATABASE.CONNECTION.NAME,
            type: 'postgres',
            host: this.databaseConfigModel.host,
            port: this.databaseConfigModel.port,
            username: this.databaseConfigModel.username,
            password: this.databaseConfigModel.password,
            database: this.databaseConfigModel.database,
            logging: true,
            synchronize: this.databaseConfigModel.synchronize,
            entities: [],
        });
    }

    async getConnectionAsObs():Promise<Observable<Connection>> {
        // return new Observable<Connection>(obs => {
        //     this.createPostgresConnection().then((conn: Connection)  => {
        //         console.log('getting connection success');
        //         obs.next(conn);
        //         obs.complete();
        //     }).catch(err => {
        //         console.log('err in creating conn obs:', err);
        //         obs.error(err);
        //     });
        //
        // })
        if (AppUtilService.isNullOrUndefined(this.dbConn)) {
            console.log('dbConn is undefined', this.dbConn);
            try {
                console.log('creating conn first time');
                const conn = await this.createPostgresConnection();

                this.databaseConnSubject.next(conn);
            } catch (err) {
                console.log('err out', err);
                // bit of a hack for custom created connections in typeorm
                if( err.name === 'AlreadyHasActiveConnectionError') {
                    //means there is already a typeorm connection - just retunr the connection
                    this.databaseConnSubject.next(getConnection(this.databaseConfigModel.connectionName));
                } else {
                    this.databaseConnSubject.next(err);
                }
            }
        }
        return this.databaseConnSubject.asObservable();
    }

    // Using take operator is sometimes necessary because once we get hold of the databaseConn as stream, any new
    // conn requests will automatically be discarded.
    async getDatabaseConnectionAfterImplicitRetries(): Promise<any> {
        const obs = await this.getConnectionAsObs();
        return new Promise((res, rej) => {
            this.retryService
                .retryConnection(obs)
                .pipe(take(1))
                .subscribe(
                    data => {
                        res(data);
                    },
                    err => {
                        console.log('err in data:', err);
                        rej(err);
                    },
                );
        });
    }
}

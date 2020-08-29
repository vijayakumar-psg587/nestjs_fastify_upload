import {DatabaseConfigModel} from "../database-config.model";
import {DatabaseTypeEnum} from "../enums/database-type.enum";
import {AppUtilService} from "../../../shared/services/app-util.service";
import {AppConfigService} from "../../../shared/services/app-config.service";
import {APP_CONSTANTS} from "../../../shared/util/app-constants";

export class DatabaseConfigModelBuilder {
    private databaseConfigModel: DatabaseConfigModel;

    constructor() {
        this.databaseConfigModel = {
            type: DatabaseTypeEnum.POSTGRES,
            connectionName: APP_CONSTANTS.DATABASE.CONNECTION.NAME,
            database: '',
            host: '',
            username: '',
            password: '',
            port: 0,
            synchronize: false
        }
    }

    setType(inputType: DatabaseTypeEnum): DatabaseConfigModelBuilder {
        this.databaseConfigModel.type = inputType;
        return this;
    }

    setConnectionName(inputConnectionName: string): DatabaseConfigModelBuilder {
        this.databaseConfigModel.connectionName = inputConnectionName;
        return this;
    }

    setUser(inputUser: string): DatabaseConfigModelBuilder {
        this.databaseConfigModel.username=inputUser;
        return this;
    }

    setPassword(inputPassword: string): DatabaseConfigModelBuilder {
        this.databaseConfigModel.password=inputPassword;
        return this;
    }

    setPort(inputPort: string): DatabaseConfigModelBuilder {
        this.databaseConfigModel.port=parseInt(inputPort);
        return this;
    }

    setHost(inputHost: string): DatabaseConfigModelBuilder {
        this.databaseConfigModel.host =inputHost;
        return this;
    }

    isSynchronize(inputFlag: boolean): DatabaseConfigModelBuilder {
        this.databaseConfigModel.synchronize = inputFlag;
        return this;
    }

    setRetries(retry: string):DatabaseConfigModelBuilder {
        this.databaseConfigModel.retires= parseInt(retry);
        return this;
    }

    setRetryDelay(retryDelay: string):DatabaseConfigModelBuilder {
        this.databaseConfigModel.retryDelay = parseInt(retryDelay);
        return this;
    }

    build():DatabaseConfigModel {
        if(!AppUtilService.isNullOrUndefined(this.databaseConfigModel)) {
            return this.databaseConfigModel;
        } else {
            throw AppConfigService.getCustomError('FID-Custom', `${this.databaseConfigModel} is either empty or undefined. 
            Make sure that is has atleast one to build`);
        }

    }
}

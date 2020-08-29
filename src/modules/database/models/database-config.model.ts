import {DatabaseTypeEnum} from "./enums/database-type.enum";

export class DatabaseConfigModel {
 host: string;
 port: number;
 connectionName: string;
 database: string;
 type:DatabaseTypeEnum;
 username: string;
 password: string;
 retires ?: number;
 retryDelay ?: number;
 synchronize: boolean;
}
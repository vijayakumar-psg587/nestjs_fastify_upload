import * as fastify from 'fastify';
import { AppConfigService } from './modules/shared/services/app-config.service';
import { CommonModel } from './modules/shared/models/common.model';
import { v4 as uuidv4 } from 'uuid';
import { AppUtilService } from './modules/shared/services/app-util.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerModel } from './modules/shared/models/swagger.model';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { APP_CONSTANTS } from './modules/shared/util/app-constants';
import { CorsInterceptor } from './modules/shared/interceptors/cors.interceptor';
import { SharedModule } from './modules/shared/shared.module';
import * as fastifyHelmet from 'fastify-helmet';
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as fastifyCookie from 'fastify-cookie';
import * as fastifyCSRF from 'fastify-csrf';
import * as multer from 'fastify-multer';
import {DatabaseModule} from "./modules/database/database.module";
import {DatabaseConnService} from "./modules/database/services/database-conn/database-conn.service";
import * as path from 'path';

export class ServerAdapter {
    private readonly appConfigModel: CommonModel;
    private readonly appSwaggerModel: SwaggerModel;
    private fastifyInstance: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
    constructor() {
        this.appConfigModel = AppConfigService.getAppCommonConfig();
        this.appSwaggerModel = AppConfigService.getSwaggerModel();
    }

    configureFastifyServer(): fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> {
        // const httpsOptions = {
        //     cert: fs.readFileSync(path.join(process.cwd() + '/certs/cert.pem')),
        //     key: fs.readFileSync(path.join(process.cwd() + '/certs/key.pem')),
        //     allowHTTP1: true,
        //     rejectUnauthorized: true,
        // };

        if (AppUtilService.isNullOrUndefined(this.fastifyInstance)) {
            // @ts-ignore
            this.fastifyInstance = fastify({
                bodyLimit: this.appConfigModel.body_limit,
                trustProxy: true,
                pluginTimeout: 20000,
                disableRequestLogging: true,
                genReqId: () => {
                    return uuidv4().toString();
                },
                modifyCoreObjects: true,
                ignoreTrailingSlash: true,
            });
        }

        return this.fastifyInstance;
    }

    configureGlobalInterceptors(app: NestFastifyApplication) {
        const corsInterceptor = app.select(SharedModule).get(CorsInterceptor);
        // const reqHeaderInterceptor = app.select(SharedModule).get(ReqHeaderInterceptor);
        // TODO: logging interceptor is required
        app.useGlobalInterceptors(corsInterceptor);
    }

    configureMulter(app){
        app.register(multer( {dest:path.join(process.cwd()+'/upload'),
        limits:{
            fields: 5, //Number of non-file fields allowed
            files: 1,
            fileSize: 2097152,// 2 MB,
        }}).contentParser);
    }
    configureSecurity(app) {
        app.register(fastifyHelmet, {
            hsts: {
                strictTransportSecurity: {
                    maxAge: 123456,
                    includeSubDomains: true,
                }
            },
            dnsPrefetchControl: {
                allow: false
            },
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'", "'unsafe-inline'", "data:"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    objectSrc: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            }
        });
        // app.register(require('fastify-cookie'), {key: '_csrf'});
        // app.register(require('fastify-csrf'), { cookie: true, secure: true, ignoreMethods: ['GET', 'OPTIONS', 'HEAD']});
    }

    async configureDbConn(app: NestFastifyApplication) {
       const dbService = app.select(DatabaseModule).get(DatabaseConnService);
       try {
           await dbService.getDatabaseConnectionAfterImplicitRetries();
           console.log('dbConn created successfully');
       } catch(err) {
           console.log('database err:', err);
       }

    }

    configureSwaggerModel() {
        console.log(this.appSwaggerModel);
        return new DocumentBuilder()
            .setTitle(this.appSwaggerModel.title)
            .setDescription(this.appSwaggerModel.description)
            .setVersion(this.appSwaggerModel.version)
            .setBasePath(this.appSwaggerModel.context_path)
            .setTermsOfService(this.appSwaggerModel.tos)
            .setContact(this.appSwaggerModel.name, '', this.appSwaggerModel.email)
            .build();
    }

    configureSwagger(app: NestFastifyApplication) {
        const swaggerDoc = SwaggerModule.createDocument(app, this.configureSwaggerModel());
        SwaggerModule.setup(this.appSwaggerModel.context_path + APP_CONSTANTS.CHAR.SLASH + this.appSwaggerModel.url, app, swaggerDoc, {
            swaggerUrl: `${this.appSwaggerModel.context_path}+\json`,
            swaggerOptions: {
                docExpansion: true,
                filter: true,
                showRequestDuration: true,
                tagsSorter: 'alpha',
            },
        });
    }
}

export const SERVERADAPTERINSTANCE = new ServerAdapter();

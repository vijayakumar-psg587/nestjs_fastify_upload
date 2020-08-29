import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import * as fastify from 'fastify';
import { APP_CONSTANTS } from '../util/app-constants';
import { AppUtilService } from '../services/app-util.service';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from '../services/app-config.service';
@Injectable()
export class CorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: fastify.FastifyRequest = context.switchToHttp().getRequest();
        const res: fastify.FastifyReply<any> = context.switchToHttp().getResponse();
        console.log('coming in cors');
        const hostHeader = request.headers['host'];
        const originHeader = request.headers['origin'] && true ? <string>request.headers['origin'] : null;
        console.log('origin header', originHeader);
        let allowedHostOrOrigin = null;
        if (!AppUtilService.isNullOrUndefined(hostHeader)) {
            allowedHostOrOrigin = APP_CONSTANTS.CORS.WHITELIST.filter(item => item.includes(hostHeader));
        } else if (!AppUtilService.isNullOrUndefined(originHeader)) {
            allowedHostOrOrigin = APP_CONSTANTS.CORS.WHITELIST.filter(item => item.includes(originHeader));
        }

        if (allowedHostOrOrigin) {
            const corsMap = new Map();
            APP_CONSTANTS.CORS.HEADERS.map(item => {
                item = item.toLowerCase();
                if (item.includes('Origin'.toLowerCase())) {
                    corsMap.set(item, request.headers['host'] ? request.headers['host'] : request.headers['origin']);
                } else if (item.includes('Credentials'.toLowerCase())) {
                    corsMap.set(item, APP_CONSTANTS.CORS.ALLOW_CRED);
                } else if (item.includes('Method'.toLowerCase())) {
                    corsMap.set(item, [...APP_CONSTANTS.CORS.ALLOW_METHODS].join(','));
                } else if (item.includes('Headers'.toLowerCase())) {
                    corsMap.set(item, [...APP_CONSTANTS.CORS.ALLOW_HEADERS].join(','));
                }
            });

            // @ts-ignore
            console.log('cors headers:', Object.fromEntries(corsMap));
            // @ts-ignore
            res.headers(Object.fromEntries(corsMap));
            return next.handle();
        } else {
            return next.handle().pipe(
                switchMap(() => {
                    return throwError(
                        AppConfigService.getCustomError('FID-CORS', `Cors does not accept origin/host of ${originHeader}/${hostHeader}`),
                    );
                }),
            );
        }
    }
}

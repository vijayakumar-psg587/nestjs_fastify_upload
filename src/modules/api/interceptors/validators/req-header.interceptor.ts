import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { APP_CONSTANTS } from '../../../shared/util/app-constants';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { FastifyRequest } from 'fastify';
import validate from 'uuid-validate';
import validator from 'validator';
import { UserIdType } from '../../../shared/models/enums/headers/user-id-type.enum';
import { AppConfigService } from '../../../shared/services/app-config.service';
import {PrincipalRoleType} from "../../../shared/models/enums/headers/principal-role.enum";
@Injectable()
export class ReqHeaderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: FastifyRequest = context.switchToHttp().getRequest();
        const mandatoryHeaderList = Object.keys(req.headers).filter(headerKey =>
            APP_CONSTANTS.MANDATORY_HEADERS_NAME_LIST.includes(headerKey.toUpperCase()),
        );

        if (mandatoryHeaderList.length > 0 && mandatoryHeaderList.length === APP_CONSTANTS.MANDATORY_HEADERS_NAME_LIST.length) {
            // it means that we have all the mandatory headers
            // now check the values
            this.validateHeaders(mandatoryHeaderList, req);
        } else {
            return throwError(AppConfigService.getCustomError('FID-HEEADER', 'Required headers are missing'));
        }
        return next.handle();
    }

    private validateHeaders(headerList: string[], req: FastifyRequest) {
        let errMessage = '';
        let headerVal = '';
        headerList.forEach(item => {
            headerVal = (req.headers[item] as string);
            if (item.includes('TRACKING'.toLowerCase()) && !validator.isUUID(headerVal, '4')) {
                // then throw err
                errMessage = errMessage + `Header - ${item} of val ${headerVal} is not a valid uuid \n`;
            } else if (item.includes('USER-TYPE'.toLowerCase()) && !UserIdType[headerVal]) {
                errMessage =
                    errMessage +
                    `Header - ${item} of val ${headerVal} is not a valid UserIdType.
                        ValidHeaders are ${Object.keys(UserIdType)} \n`;
            } else if(item.includes('PRINCIPAL'.toLowerCase()) && !PrincipalRoleType[headerVal]) {
                errMessage = errMessage + `Header - ${item} of val ${headerVal} is not a valid PrincipalRoleType.
                        ValidHeaders are ${Object.keys(PrincipalRoleType)} \n`;
            } else if(item.includes('PROCESS'.toLowerCase())
                && !validator.isUUID(headerVal.substr(3, headerVal.length-1), '4')) {
                errMessage = errMessage + `Header - ${item} of val ${headerVal} doesn't contain a valid UUID \n`;
            }
        });

        if (errMessage != null && errMessage.length > 0)  {
            throw (AppConfigService.getCustomError('FID-HEADER', errMessage));
        }
    }
}

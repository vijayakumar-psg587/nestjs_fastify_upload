import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { AppConfigService } from '../../shared/services/app-config.service';
import { APP_CONSTANTS } from '../../shared/util/app-constants';

@Injectable()
export class FileUploadValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: FastifyRequest = context.switchToHttp().getRequest();
        // content type comes with multipart/form-data;boundary----. we dont need to valdidate the boundary
        // TODO: handle split errors based on semicolon
        const contentType = req.headers['content-type'].split(APP_CONSTANTS.CHAR.SEMI_COLON)[0];

        contentType != null ? this.headerValidation(contentType) : this.throwError(contentType);
        return next.handle();
    }

    headerValidation(contentType) {
        return APP_CONSTANTS.REGEX.MULTIPART_CONTENT_TYPE.test(contentType) ? true : this.throwError(contentType);
    }
    throwError(contentType: string) {
        throw AppConfigService.getCustomError(
            'FID-HEADERS',
            `Request header does not contain multipart type: 
    Provided incorrect type - ${contentType}`,
        );
    }
}

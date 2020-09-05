import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { APP_CONSTANTS } from '../../shared/util/app-constants';
import { AppConfigService } from '../../shared/services/app-config.service';

@Injectable()
export class FilenamePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value != null && APP_CONSTANTS.REGEX.FILE_NAME.test(value)) {
            return value;
        } else {
            throw AppConfigService.getCustomError('FID-REQ', `Invalid query param passed name - ${value}`);
        }
    }
}

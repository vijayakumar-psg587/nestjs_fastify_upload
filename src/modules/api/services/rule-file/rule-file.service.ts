import { Injectable, Scope } from '@nestjs/common';
import { promisify } from 'util';
import * as fs from 'fs';
import * as stream from 'stream';
import * as path from 'path';
import { RuleFileCreate } from '../../models/rule-file-create.model';
import { plainToClass } from 'class-transformer';
import { FileCreateResponse } from '../../models/request-response/file-create.response';
import { APP_CONSTANTS } from '../../../shared/util/app-constants';
import { FileExtEnum } from '../../models/enums/file-ext.enum';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { getConnection, In } from 'typeorm/index';
import { RuleFileEntity } from '../../../database/models/entities/rule-file.entity';
import { RuleFileDetail } from '../../models/rule-file.model';
import { FastifyReply } from 'fastify';
import { ApiUtilService } from '../api-util/api-util.service';
const archiver = require('archiver');

@Injectable({
    scope: Scope.DEFAULT,
})
export class RuleFileService {
    private fileName: string;
    private readonly pipelineAsync;
    constructor(private readonly apiUtilService: ApiUtilService) {
        this.fileName = '';
        this.pipelineAsync = promisify(stream.pipeline);
    }

    async deleteFiles(filenameList: string[]) {
        const nameList = filenameList.map(item => item.split('.')[0]);
        const extList = filenameList.map(item => item.split('.')[1]);
        return await getConnection()
            .getRepository(RuleFileEntity)
            .delete({
                name: In(nameList),
                ext: In(extList),
            });
    }

    async getFiles(fileList: string[], resp: FastifyReply) {
        const nameList = fileList.map(item => item.split('.')[0]);
        const extList = fileList.map(item => item.split('.')[1]);
        const resultEntities = await getConnection()
            .getRepository(RuleFileEntity)
            .find({
                loadEagerRelations: true,
                order: {
                    recUpdTs: 'ASC',
                },
                where: {
                    name: In(nameList),
                    ext: In(extList),
                },
            });

        const ruleFileDetails = plainToClass(RuleFileDetail, resultEntities, {
            excludeExtraneousValues: true,
        });

        // Upload to download Path
        await this.apiUtilService.createFiles(path.join(process.cwd(), '/download'), ruleFileDetails);

        // Send the stream
        resp.send(this.apiUtilService.createZip(path.join(process.cwd(), '/download')));
    }

    async fileUpload(file: Buffer, fileCreate: RuleFileCreate) {
        // load it to upload dir
        // validate if it has proper extension
        const fileExt = fileCreate.originalName.split(APP_CONSTANTS.CHAR.FULL_STOP)[1];

        const isExtAllowed = Object.keys(FileExtEnum).filter(item => item === fileExt);
        if (isExtAllowed) {
            fileCreate.fileExt = fileExt;

            const writeStream = fs.createWriteStream(
                path.join(process.cwd(), '/upload', `/${fileCreate.fileName}.${fileExt}`),
            );
            try {
                // Upload to local dir
                await this.pipelineAsync(this.apiUtilService.getReadableStream(file), writeStream);

                //Now upload to db
                await ApiUtilService.uploadFileToDb(file, fileCreate);

                return plainToClass(FileCreateResponse, {
                    status: 500,
                    message: `${fileCreate.fileName} - FileUploaded successfully`,
                });
            } catch (err) {
                return plainToClass(FileCreateResponse, {
                    status: '500',
                    message: err.message,
                });
            }
        } else {
            throw AppConfigService.getCustomError('FID-REQ', `Incorrect extension`);
        }
    }
}

import { Injectable, Scope } from '@nestjs/common';
import { RuleFileDetail } from '../../models/rule-file.model';
import { APP_CONSTANTS } from '../../../shared/util/app-constants';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as stream from 'stream';
import { RuleFileCreate } from '../../models/rule-file-create.model';
import { RuleFileEntity } from '../../../database/models/entities/rule-file.entity';
import { v4 as uuidv4 } from 'uuid';
import { AppUtilService } from '../../../shared/services/app-util.service';
import { getConnection } from 'typeorm/index';
import archiver = require('archiver');

@Injectable({
    scope: Scope.REQUEST,
})
export class ApiUtilService {
    private readonly pipelineAsync;
    constructor() {
        this.pipelineAsync = promisify(stream.pipeline);
    }

    async createFiles(destination: string, ruleFileDetails: RuleFileDetail[]) {
        let fsStream = null;
        ruleFileDetails.map(async fileDetail => {
            const fileName = fileDetail.name + APP_CONSTANTS.CHAR.FULL_STOP + fileDetail.ext;
            fsStream = fs.createWriteStream(path.join(destination, `/${fileName}`));
            await this.pipelineAsync(this.getReadableStream(fileDetail.file), fsStream);
        });
    }

    createZip(destination: string) {
        const archive = archiver('zip');
        archive.on('error', function(err) {
            throw err;
        });
        archive.directory(destination, false);
        archive.finalize();
        return archive;
    }

    getReadableStream(buffer: Buffer) {
        // customReadableStream.push(null);
        return new stream.Readable({
            read(chunkSize) {
                this.push(buffer);
                this.push(null);
            },
        });
    }

    static uploadFileToDb = async (file: Buffer, fileCreate: RuleFileCreate) => {
        const ruleFileEntity = new RuleFileEntity();
        ruleFileEntity.name = fileCreate.fileName;
        ruleFileEntity.ext = fileCreate.fileExt;
        ruleFileEntity.file = file;
        ruleFileEntity.id = uuidv4();
        ruleFileEntity.recUpdTs = AppUtilService.defaultISOTime();
        ruleFileEntity.recUpdUser = 'APP-ID';
        return new Promise(async (res, rej) => {
            try {
                // await getConnection(APP_CONSTANTS.DATABASE.CONNECTION.NAME)
                //     .connect();
                const saved = getConnection()
                    .getRepository<RuleFileEntity>(RuleFileEntity)
                    .save(ruleFileEntity);
                console.log('saved', saved);
                res(saved);
            } catch (err) {
                console.log('err saving', err);
                rej(err);
            }
        });
    };
}

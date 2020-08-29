import {HttpStatus, Injectable, Scope} from '@nestjs/common';
import fastify, {FastifyReply, FastifyRequest} from 'fastify';
import {AppConfigService} from "../../../shared/services/app-config.service";
import {promisify} from "util";
import * as fs from 'fs';
import * as stream from 'stream';
import * as path from 'path';

@Injectable({
    scope: Scope.DEFAULT
})
export class RuleFileService {

    constructor() {
    }

    async fileUploadService(req: FastifyRequest, resp: FastifyReply): Promise<any> {
        // TODO: check in an interceptor
        let fileName = '';
       if(!req.isMultipart()) {
           throw AppConfigService.getCustomError('FID-REQ', `Incorrect request passed`);
       }

       const uploadFormFields = req.multipart(this.fileUploadHandler, next);
        uploadFormFields.on('field', function(key: any, value: any) {

            console.log('form-data', key, value);
            if(key.toLowerCase() === 'fileName'.toLowerCase()) {
                fileName = key;
            }
        });

        async function next(err: Error){
            if(err) {
                throw AppConfigService.getCustomError('FID-REQ', `Error uploading file - ${err.message}`);
            } else {
                resp.code(HttpStatus.CREATED).send(`File upload successfully - ${fileName}`);
            }
        }
    }

    async fileUploadHandler(field: string, file: any, filename: string, encoding: string, mimetype: string): Promise<void> {
        const pipelineStream = promisify(stream.pipeline);
        console.log('fileds in handler:', field, filename);
        //create a writeStream
        const ws = fs.createWriteStream(path.join(`${process.cwd()}/upload/${filename}`));

        await pipelineStream(file, ws).catch(err => {
            console.log('err captured',err);
            throw AppConfigService.getCustomError('FID-REQ', 'Cannot write file:'+err);
        });
    }


}

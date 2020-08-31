import {
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  Res,
  Scope
} from "@nestjs/common";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { AppConfigService } from "../../../shared/services/app-config.service";
import { promisify } from "util";
import * as fs from "fs";
import * as stream from "stream";
import * as path from "path";

import { reqFileUploadValidator } from "../../decorators/file-upload-req-validator.decorator";

@Injectable({
  scope: Scope.DEFAULT
})
export class RuleFileService {
  private resp;
  private fileName: string;
  constructor() {
    this.fileName = "";
  }

  @reqFileUploadValidator
  async fileUploadService(req, reply: FastifyReply): Promise<any> {
    let fileName = "";
    req.multipart(this.fileUploadHandler, async function(err: Error) {
      if (err) {
        throw AppConfigService.getCustomError(
          "FID-REQ",
          `Error uploading file - ${err.message}`
        );
      } else {
        reply
          .code(HttpStatus.CREATED)
          .send(`File upload successfully - ${fileName}`);
      }
    });
  }

  async fileUploadHandler(
    field: string,
    file: any,
    filename: string,
    encoding: string,
    mimetype: string
  ): Promise<void> {
    const pipelineStream = promisify(stream.pipeline);
    console.log("fileds in handler:", field, filename);
    //create a writeStream
    const ws = fs.createWriteStream(
      path.join(`${process.cwd()}/upload/${filename}`)
    );

    await pipelineStream(file, ws).catch(err => {
      console.log("err captured", err);
      throw AppConfigService.getCustomError(
        "FID-REQ",
        "Cannot write file:" + err
      );
    });
  }
}

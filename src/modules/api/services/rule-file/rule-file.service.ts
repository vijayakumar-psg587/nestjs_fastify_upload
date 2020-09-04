import { Injectable, Scope } from "@nestjs/common";
import { promisify } from "util";
import * as fs from "fs";
import * as stream from "stream";
import { Readable } from "stream";
import * as path from "path";
import { RuleFileCreate } from "../../models/rule-file-create.model";
import { plainToClass } from "class-transformer";
import { FileCreateResponse } from "../../models/request-response/file-create.response";
import { APP_CONSTANTS } from "../../../shared/util/app-constants";
import {FileExtEnum} from "../../models/enums/file-ext.enum";
import {AppConfigService} from "../../../shared/services/app-config.service";
import {getConnection, getRepository} from "typeorm/index";
import {RuleFileEntity} from "../../../database/models/entities/rule-file.entity";
import {v4 as uuidv4} from 'uuid';
import {AppUtilService} from "../../../shared/services/app-util.service";

@Injectable({
  scope: Scope.DEFAULT
})
export class RuleFileService {
  private fileName: string;
  constructor() {
    this.fileName = "";
  }

  async sampleService(test: String) {
    console.log(test);
    return { data: test };
  }


  async fileUpload(file: Buffer, fileCreate: RuleFileCreate) {
    // load it to upload dir
    // validate if it has proper extension
    const fileExt = fileCreate.originalName.split(
      APP_CONSTANTS.CHAR.FULL_STOP
    )[1];

    const isExtAllowed = Object.keys(FileExtEnum).filter(item => item === fileExt);
    if(isExtAllowed) {
      fileCreate.fileExt = fileExt;
      const pipelineAsync = promisify(stream.pipeline);
      const writeStream = fs.createWriteStream(
          path.join(
              process.cwd(),
              "/upload",
              `/${fileCreate.fileName}.${fileExt}`
          )
      );
      try {
        // Upload to local dir
        await pipelineAsync(RuleFileService.getReadableStream(file), writeStream);

        //Now upload to db
        await this.uploadFileToDb(file, fileCreate);

        return plainToClass(FileCreateResponse, {
          status: 500,
          message: `${fileCreate.fileName} - FileUploaded successfully`
        });
      } catch (err) {
        return plainToClass(FileCreateResponse, {
          status: "500",
          message: err.message
        });
      }
    } else {
      throw AppConfigService.getCustomError('FID-REQ', `Incorrect extension`);
    }


  }

  private static getReadableStream(buffer: Buffer) {
    // customReadableStream.push(null);
    return new stream.Readable({
      read(chunkSize) {
        this.push(buffer);
        this.push(null);
      }
    });
  }

   uploadFileToDb = async (file: Buffer, fileCreate: RuleFileCreate) => {

    const ruleFileEntity = new RuleFileEntity();
    ruleFileEntity.name = fileCreate.fileName;
    ruleFileEntity.ext = fileCreate.fileExt;
    ruleFileEntity.file = file;
    ruleFileEntity.id = uuidv4();
    ruleFileEntity.recUpdTs = AppUtilService.defaultISOTime();
    ruleFileEntity.recUpdUser = 'APP-ID'
    return new Promise(async (res, rej) => {
      try {
        // await getConnection(APP_CONSTANTS.DATABASE.CONNECTION.NAME)
        //     .connect();
        const saved = getConnection().getRepository<RuleFileEntity>(RuleFileEntity)
            .save(ruleFileEntity);
        console.log('saved', saved);
        res(saved);
      } catch(err) {
        console.log('err saving', err);
        rej(err);
      }



    });


  }

}

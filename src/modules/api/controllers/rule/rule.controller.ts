import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
  Body, UploadedFiles, UploadedFile,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RuleFileService } from "../../services/rule-file/rule-file.service";
import { FastifyRequest, FastifyReply } from "fastify";
import {FileUploadValidationInterceptor} from "../../interceptors/file-upload-validation.interceptor";
import {FileInterceptor, FilesInterceptor} from "@webundsoehne/nest-fastify-file-upload";
import {IncomingMessage} from "http";
import {RuleFileCreate} from "../../models/rule-file-create.model";

@ApiTags("Rules")
@Controller("rule")
export class RuleController {
  constructor(private readonly fileService: RuleFileService) {}
  @Get("")
  async testGet() {
    return { done: "Test" };
  }

  // @UseInterceptors(FileUploadValidationInterceptor)
  // @Post("/upload")
  // async uploadFile(
  //     @Req() req: FastifyRequest,
  //   @Res() reply: FastifyReply
  // ) {
  //   // console.log("data body", fileCreate);
  //   return await this.fileService.fileUploadService(req,reply);
  // }


  @Post("/uploadSample")
  async sample(
      @Req() req: FastifyRequest,
      @Res() reply: FastifyReply
  ) {
    return await this.fileService.sampleService('test');
  }

  @UseInterceptors(FileUploadValidationInterceptor, FileInterceptor('file'))
  @Post('/multerSample')
  async multerUploadFiles(@UploadedFile() file, @Body() ruleFileCreate: RuleFileCreate) {
    console.log('data sent', ruleFileCreate);
    console.log(file);
    // getting the original name of the file - no matter what
    ruleFileCreate.originalName = file.originalname;
    return await this.fileService.fileUpload(file.buffer, ruleFileCreate);
  }
}

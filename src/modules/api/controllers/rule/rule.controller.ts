import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseInterceptors,
    Body,
    UploadedFiles,
    UploadedFile,
    Query, HttpCode, HttpStatus, Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RuleFileService } from '../../services/rule-file/rule-file.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FileUploadValidationInterceptor } from '../../interceptors/file-upload-validation.interceptor';
import { FileInterceptor, FilesInterceptor } from '@webundsoehne/nest-fastify-file-upload';
import {IncomingMessage, ServerResponse} from 'http';
import { RuleFileCreate } from '../../models/rule-file-create.model';
import { FilenameArrayPipe } from '../../pipes/filename-array.pipe';
import { FilenamePipe } from '../../pipes/filename.pipe';
import {RuleFileCreateList} from "../../models/rule-file-create-list.model";

@ApiTags('Rules')
@Controller('rule')
export class RuleController {
    constructor(private readonly fileService: RuleFileService) {}
    @Get('')
    async testGet() {
        return { done: 'Test' };
    }

    @Get('/files')
    async getFilesByName(
        @Query('names', new FilenameArrayPipe<FilenamePipe>(new FilenamePipe()))
        fileNameList: string[],
        @Res() resp: FastifyReply,
    ) {
        console.log(fileNameList);
        await this.fileService.getFiles(fileNameList, resp);
    }

    @Delete('/files')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteFiles(@Query('names', new FilenameArrayPipe<FilenamePipe>(new FilenamePipe()))
                               fileNameList: string[]) {
     await this.fileService.deleteFiles(fileNameList);
    }

    @UseInterceptors(FileUploadValidationInterceptor, FileInterceptor('file'))
    @Post('/upload')
    async multerUploadFiles(@UploadedFile() file, @Body() ruleFileCreate: RuleFileCreate) {
        // getting the original name of the file - no matter what
        ruleFileCreate.originalName = file.originalname;
        return await this.fileService.fileUpload(file.buffer, ruleFileCreate);
    }
}

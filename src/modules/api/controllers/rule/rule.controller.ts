import {Controller, Get, Post, Req, Res, UseInterceptors} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {DatabaseInterceptor} from "../../interceptors/database.interceptor";
import {RuleFileService} from "../../services/rule-file/rule-file.service";
import multer from 'fastify-multer';
import {FastifyRequest, FastifyReply} from 'fastify';


@ApiTags('Rules')
@Controller('rule')
// @UseInterceptors(DatabaseInterceptor)
export class RuleController {
    constructor(private readonly fileService: RuleFileService) {
    }
    @Get('')
    async testGet() {
        return {done: 'Test'};
    }

    @Post('/fileUpload')
    async uploadFile(@Req() req: FastifyRequest, @Res() reply: FastifyReply ) {
       return await this.fileService.fileUploadService(req, reply)

    }
}

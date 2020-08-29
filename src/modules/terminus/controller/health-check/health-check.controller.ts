import {Controller, Get, Res} from '@nestjs/common';
import {HealthCheckService} from "../../service/healh-check/health-check.service";
import * as fastify from "fastify";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Terminus')
@Controller('health-check')
export class HealthCheckController {
    private statusCheck;
    constructor(private healthCheckService: HealthCheckService) {

    }
    // async onModuleInit(): Promise<any> {
    // 	try {
    // 		this.statusCheck = await this.healthCheckService.checkStatus();
    //
    // 	}catch(err) {
    // 		console.log('err captured', err);
    // 		this.statusCheck = err;
    // 	}
    // }

    @Get('/health-check/health')
    async getCheckStatus(@Res() resp: fastify.FastifyReply<any>) {
        console.log('resply being called');
        try {
            const val = await this.healthCheckService.checkStatus();
            console.log ('no err:', val);
            resp.status(200).send(val);
        } catch(err) {
            console.log('err cap:', err);
            throw(err);
        }

    }

}

import { ArgumentsHost, Catch, ExceptionFilter, Inject, Injectable, Scope } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        console.log('getting exception inside custom filter', exception);
        const res: FastifyReply = host.switchToHttp().getResponse() as FastifyReply;

        // send the response here
        res.send({ error: exception });
    }
}

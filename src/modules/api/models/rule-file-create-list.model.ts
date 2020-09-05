import {Length, IsString, IsEnum, IsOptional, IsNotEmpty, IsArray} from 'class-validator';
import { FileExtEnum } from './enums/file-ext.enum';
import { Expose, Type } from 'class-transformer';

export class RuleFileCreateList {
    @Expose({ name: 'fileName' })
    @IsNotEmpty()
    @IsArray()
    @Length(2, 50, {
        always: true,
        each: true,
        context: {
            errorCode: 'REQ-000',
            message: `Filename shouldbe within 2 and can reach a max of 50 characters`,
        },
    })
    fileName: string[];

    @IsArray()
    @IsOptional()
    @Length(2, 50, {
        always: true,
        each: true,
        context: {
            errorCode: 'REQ-000',
            message: `Filename's original name is missing. Please upload with extension`,
        },
    })
    originalName: string[];

    @IsOptional({ message: 'REQ-000 - FileExt should be provided' })
    @IsEnum(FileExtEnum, { always: false })
    fileExt: string;

    @IsOptional()
    userId: string;
}

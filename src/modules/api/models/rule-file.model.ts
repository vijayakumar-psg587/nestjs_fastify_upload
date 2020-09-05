import { IsUUID, Length, IsEnum, IsString, Matches, IsOptional, IsNotEmptyObject } from 'class-validator';
import { FileExtEnum } from './enums/file-ext.enum';
import { Updatable } from './updatable.model';
import { Expose, Type } from 'class-transformer';

export class RuleFile {
    @Expose()
    @IsUUID('4', { always: true })
    id: string;

    @Expose()
    @Length(2, 50, {
        always: true,
        context: {
            errorCode: 'REQ-000',
            message: `Filename shouldbe within 2 and can reach a max of 50 characters`,
        },
    })
    name: string;

    @Expose()
    @IsEnum(FileExtEnum, { always: true })
    ext: string;

    @Expose()
    @IsNotEmptyObject({ message: 'File is either corrupated or empty' })
    @Type(() => Buffer)
    file: Buffer;
}

export class RuleFileDetail extends RuleFile implements Updatable {
    @IsString()
    recUpdUser: string;

    @IsString()
    recUpdTs: string;
}

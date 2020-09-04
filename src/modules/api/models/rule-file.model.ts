import {IsUUID, Length, IsEnum, IsString, Matches, IsOptional} from "class-validator";
import { FileExtEnum } from "./enums/file-ext.enum";
import { Updatable } from "./updatable.model";
import {Expose, Type} from "class-transformer";

export class RuleFile {
  @Expose()
  @IsUUID("4", { always: true })
  id: string;

  @Expose()
  @Length(2, 50, {
    always: true,
    each: true,
    context: {
      errorCode: "REQ-000",
      message: `Filename shouldbe within 2 and can reach a max of 50 characters`,
    },
  })
  fileNames: string[];

  @Expose()
  @IsEnum(FileExtEnum, { always: true, each: true })
  fileExts: string[];

  @IsOptional({each: true, message: 'File is corrupated'})
  @Type(() => Buffer)
  file: Buffer;
}

export class RuleFileDetail extends RuleFile implements Updatable {
  @IsString()
  @Matches(/[aA]{1}[\w]{6}/)
  recUpdUser: string;
}

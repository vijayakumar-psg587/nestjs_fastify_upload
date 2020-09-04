import {
  Length,
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from "class-validator";
import { FileExtEnum } from "./enums/file-ext.enum";
import { Expose, Type } from "class-transformer";

export class RuleFileCreate {
  @Expose({ name: "fileName" })
  @IsNotEmpty()
  @IsString()
  @Length(2, 50, {
    always: true,
    context: {
      errorCode: "REQ-000",
      message: `Filename shouldbe within 2 and can reach a max of 50 characters`,
    },
  })
  fileName: string;

  @IsString()
  @IsOptional()
  @Length(2, 50, {
    always: true,
    context: {
      errorCode: "REQ-000",
      message: `Filename's original name is missing. Please upload with extension`,
    },
  })
  originalName: string;

  @IsOptional({ message: 'REQ-000 - FileExt should be provided'})
  @IsEnum(FileExtEnum, {always: false})
  fileExt: string;

  @IsOptional()
  userId: string;

}

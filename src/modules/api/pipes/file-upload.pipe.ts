import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileUploadPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('mee', metadata.data);
    // console.log(value);
    if (metadata.type === "body") {
      console.log("inside body validation");
    }
    return value;
  }
}

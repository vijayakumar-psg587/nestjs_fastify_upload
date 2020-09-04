import {Expose} from "class-transformer";

export class FileCreateResponse {
    @Expose({toPlainOnly: true})
    status: number;

    @Expose({toPlainOnly: true})
    message: string
}
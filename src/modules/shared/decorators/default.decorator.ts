import {Transform} from "class-transformer";

export const DefaultDecorator = (defaultValue: any) => ((target: Object, propertyKey: string) => void) =>
    Transform((value) => value || defaultValue);

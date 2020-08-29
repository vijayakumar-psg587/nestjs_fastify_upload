import { Type } from '@nestjs/common';
import { ParameterObject, SchemaObject } from '../interfaces/open-api-spec.interface';
import { SwaggerEnumType } from '../types/swagger-enum.type';
declare type ParameterOptions = Omit<ParameterObject, 'in' | 'schema'>;
interface ApiQueryMetadata extends ParameterOptions {
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
    enumName?: string;
}
interface ApiQuerySchemaHost extends ParameterOptions {
    schema: SchemaObject;
}
export declare type ApiQueryOptions = ApiQueryMetadata | ApiQuerySchemaHost;
export declare function ApiQuery(options: ApiQueryOptions): MethodDecorator;
export {};

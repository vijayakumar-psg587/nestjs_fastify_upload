export interface PluginOptions {
    dtoFileNameSuffix?: string | string[];
    controllerFileNameSuffix?: string | string[];
    classValidatorShim?: boolean;
}
export declare const mergePluginOptions: (options?: Record<string, any>) => PluginOptions;

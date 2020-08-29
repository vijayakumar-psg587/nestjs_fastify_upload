"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeIsArrayTuple = exports.createParamDecorator = exports.createMixedDecorator = exports.createPropertyDecorator = exports.createClassDecorator = exports.createMethodDecorator = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
function createMethodDecorator(metakey, metadata) {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(metakey, metadata, descriptor.value);
        return descriptor;
    };
}
exports.createMethodDecorator = createMethodDecorator;
function createClassDecorator(metakey, metadata = []) {
    return (target) => {
        const prevValue = Reflect.getMetadata(metakey, target) || [];
        Reflect.defineMetadata(metakey, [...prevValue, ...metadata], target);
        return target;
    };
}
exports.createClassDecorator = createClassDecorator;
function createPropertyDecorator(metakey, metadata, overrideExisting = true) {
    return (target, propertyKey) => {
        const properties = Reflect.getMetadata(constants_1.DECORATORS.API_MODEL_PROPERTIES_ARRAY, target) || [];
        const key = `:${propertyKey}`;
        if (!properties.includes(key)) {
            Reflect.defineMetadata(constants_1.DECORATORS.API_MODEL_PROPERTIES_ARRAY, [...properties, `:${propertyKey}`], target);
        }
        const existingMetadata = Reflect.getMetadata(metakey, target, propertyKey);
        if (existingMetadata) {
            const newMetadata = lodash_1.pickBy(metadata, lodash_1.negate(lodash_1.isUndefined));
            const metadataToSave = overrideExisting
                ? Object.assign(Object.assign({}, existingMetadata), newMetadata) : Object.assign(Object.assign({}, newMetadata), existingMetadata);
            Reflect.defineMetadata(metakey, metadataToSave, target, propertyKey);
        }
        else {
            Reflect.defineMetadata(metakey, Object.assign({ type: Reflect.getMetadata('design:type', target, propertyKey) }, lodash_1.pickBy(metadata, lodash_1.negate(lodash_1.isUndefined))), target, propertyKey);
        }
    };
}
exports.createPropertyDecorator = createPropertyDecorator;
function createMixedDecorator(metakey, metadata) {
    return (target, key, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(metakey, metadata, descriptor.value);
            return descriptor;
        }
        Reflect.defineMetadata(metakey, metadata, target);
        return target;
    };
}
exports.createMixedDecorator = createMixedDecorator;
function createParamDecorator(metadata, initial) {
    return (target, key, descriptor) => {
        const parameters = Reflect.getMetadata(constants_1.DECORATORS.API_PARAMETERS, descriptor.value) || [];
        Reflect.defineMetadata(constants_1.DECORATORS.API_PARAMETERS, [
            ...parameters,
            Object.assign(Object.assign({}, initial), lodash_1.pickBy(metadata, lodash_1.negate(lodash_1.isUndefined)))
        ], descriptor.value);
        return descriptor;
    };
}
exports.createParamDecorator = createParamDecorator;
function getTypeIsArrayTuple(input, isArrayFlag) {
    if (!input) {
        return [input, isArrayFlag];
    }
    if (isArrayFlag) {
        return [input, isArrayFlag];
    }
    const isInputArray = lodash_1.isArray(input);
    const type = isInputArray ? input[0] : input;
    return [type, isInputArray];
}
exports.getTypeIsArrayTuple = getTypeIsArrayTuple;

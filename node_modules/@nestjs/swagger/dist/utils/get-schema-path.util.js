"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refs = exports.getSchemaPath = void 0;
const util_1 = require("util");
function getSchemaPath(model) {
    const modelName = util_1.isString(model) ? model : model && model.name;
    return `#/components/schemas/${modelName}`;
}
exports.getSchemaPath = getSchemaPath;
function refs(...models) {
    return models.map((item) => ({
        $ref: getSchemaPath(item.name)
    }));
}
exports.refs = refs;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeptSchemaById = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createDepartmentSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string(),
    })
};
exports.getDeptSchemaById = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id,
    })
};

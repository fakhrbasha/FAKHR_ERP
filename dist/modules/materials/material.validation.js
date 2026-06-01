"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMaterialSchema = exports.getMaterialSchemaById = exports.addMaterialSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
const material_enum_1 = require("../../common/enums/material.enum");
exports.addMaterialSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        description: zod_1.z.string().optional(),
        code: zod_1.z.string().min(1).optional(),
        unit: zod_1.z.enum(material_enum_1.UnitEnum),
    })
};
exports.getMaterialSchemaById = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id,
    })
};
exports.updateMaterialSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        unit: zod_1.z.string().optional()
    })
};

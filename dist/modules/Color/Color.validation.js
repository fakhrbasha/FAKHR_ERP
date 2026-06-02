"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColorSchema = exports.addColorSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.addColorSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string(),
        hexCode: zod_1.z.string(),
    })
};
exports.updateColorSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id,
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        hexCode: zod_1.z.string().optional(),
    })
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmpById = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createUserSchema = {
    body: zod_1.z.object({
        fullName: zod_1.z.string(),
        salary: zod_1.z.number(),
        phone: zod_1.z.string(),
        role: zod_1.z.string(),
        shiftId: generalRules_1.generalRules.id
    }),
    params: zod_1.z.object({
        departmentId: generalRules_1.generalRules.id
    })
};
exports.getEmpById = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    })
};

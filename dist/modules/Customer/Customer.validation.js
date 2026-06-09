"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.getCustomerByIdSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createCustomerSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(3),
        phone: zod_1.z.string().min(10),
        address: zod_1.z.string().min(3),
        note: zod_1.z.string().optional()
    })
};
exports.getCustomerByIdSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    })
};
exports.updateCustomerSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).optional(),
        phone: zod_1.z.string().min(10).optional(),
        address: zod_1.z.string().min(3).optional(),
        note: zod_1.z.string().optional()
    })
};

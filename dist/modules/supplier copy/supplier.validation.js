"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.getSupplierByIdSchema = exports.createSupplierSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createSupplierSchema = {
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(2).max(100),
        contactPerson: zod_1.z.string().min(2).max(100),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).max(15),
        address: zod_1.z.string().max(200).optional(),
        note: zod_1.z.string().max(200).optional()
    })
};
exports.getSupplierByIdSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    })
};
exports.updateSupplierSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    }),
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(2).max(100).optional(),
        contactPerson: zod_1.z.string().min(2).max(100).optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).max(15).optional(),
        address: zod_1.z.string().max(200).optional(),
        note: zod_1.z.string().max(200).optional()
    })
};

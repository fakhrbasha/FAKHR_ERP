"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.getSaleByIdSchema = exports.createSalesReturnSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createSalesReturnSchema = {
    body: zod_1.z.object({
        saleId: zod_1.z.string(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z
                .number()
                .positive(),
            reason: zod_1.z
                .string()
                .optional()
        })).min(1),
        note: zod_1.z.string().optional()
    })
};
exports.getSaleByIdSchema = {
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveOrderSchema = exports.createPurchaseOrderSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createPurchaseOrderSchema = {
    body: zod_1.z.object({
        supplierId: zod_1.z.string(),
        items: zod_1.z.array(zod_1.z.object({
            materialId: zod_1.z.string(),
            colorId: zod_1.z.string(),
            quantity: zod_1.z.number().positive(),
            unitPrice: zod_1.z.number().positive()
        })).min(1),
        notes: zod_1.z.string().optional()
    })
};
exports.approveOrderSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id,
    })
};

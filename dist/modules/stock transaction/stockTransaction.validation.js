"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyOfYarnStockSchema = exports.decreaseYarnStockSchema = exports.increaseYarnStockSchema = exports.updateYarnStockSchema = exports.addYarnStockSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.addYarnStockSchema = {
    body: zod_1.z.object({
        materialId: generalRules_1.generalRules.id,
        colorId: generalRules_1.generalRules.id,
        quantity: zod_1.z.number().nonnegative(),
        minQuantity: zod_1.z.number().nonnegative(),
    })
};
exports.updateYarnStockSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id,
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        hexCode: zod_1.z.string().optional(),
    })
};
exports.increaseYarnStockSchema = {
    params: zod_1.z.object({
        stockId: generalRules_1.generalRules.id,
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().nonnegative(),
        reason: zod_1.z.string().optional(),
    })
};
exports.decreaseYarnStockSchema = {
    params: zod_1.z.object({
        stockId: generalRules_1.generalRules.id,
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().nonnegative(),
        reason: zod_1.z.string().optional(),
    })
};
exports.historyOfYarnStockSchema = {
    params: zod_1.z.object({
        stockId: generalRules_1.generalRules.id,
    }),
};

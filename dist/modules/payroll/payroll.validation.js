"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentByIdSchema = exports.createPayrollSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
exports.createPayrollSchema = {
    body: zod_1.z.object({
        employeeId: generalRules_1.generalRules.id,
        amount: zod_1.z.number(),
        week: zod_1.z.string().optional(),
        note: zod_1.z.string().max(200).optional()
    })
};
exports.getPaymentByIdSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    })
};

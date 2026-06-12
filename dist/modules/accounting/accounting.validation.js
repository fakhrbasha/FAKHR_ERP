"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.getSaleByIdSchema = exports.createSaleSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdValidation = (value) => mongoose_1.default.Types.ObjectId.isValid(value);
exports.createSaleSchema = {
    body: zod_1.z.object({
        customerId: zod_1.z
            .string()
            .refine(objectIdValidation, {
            message: "Invalid customer id"
        }),
        items: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z
                .string()
                .refine(objectIdValidation, {
                message: "Invalid product id"
            }),
            quantity: zod_1.z
                .number()
                .positive("Quantity must be greater than 0"),
            unitPrice: zod_1.z
                .number()
                .positive("Unit price must be greater than 0")
        }))
            .min(1, "At least one product is required"),
        note: zod_1.z
            .string()
            .max(500)
            .optional()
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

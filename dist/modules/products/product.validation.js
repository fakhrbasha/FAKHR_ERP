"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProductSchema = exports.updateSupplierSchema = exports.getProductByIdSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const generalRules_1 = require("../../common/utils/generalRules");
const product_model_1 = require("../../DB/models/product.model");
exports.createProductSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string(),
        sku: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        category: zod_1.z.string(),
        sellingPrice: zod_1.z.string(),
        image: zod_1.z.string().optional(),
        availableSizes: zod_1.z.array(zod_1.z.nativeEnum(product_model_1.ProductSize)),
        availableColors: zod_1.z.string().array(),
        quantity: zod_1.z.string(),
    })
};
exports.getProductByIdSchema = {
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
exports.editProductSchema = {
    params: zod_1.z.object({
        id: generalRules_1.generalRules.id
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        sku: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        sellingPrice: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        availableSizes: zod_1.z.array(zod_1.z.nativeEnum(product_model_1.ProductSize)).optional(),
        availableColors: zod_1.z.array(zod_1.z.string()).optional(),
        quantity: zod_1.z.string().optional(),
        isActive: zod_1.z.union([zod_1.z.boolean(), zod_1.z.string()]).transform((val) => {
            if (typeof val === "boolean")
                return val;
            return val === "true" || val === "1";
        }).optional()
    })
};

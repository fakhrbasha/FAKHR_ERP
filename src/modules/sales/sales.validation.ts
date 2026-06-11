import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
import mongoose from "mongoose";

const objectIdValidation = (value: string) =>
    mongoose.Types.ObjectId.isValid(value);

export const createSaleSchema = {
    body: z.object({
        customerId: z
            .string()
            .refine(objectIdValidation, {
                message: "Invalid customer id"
            }),

        items: z
            .array(
                z.object({
                    productId: z
                        .string()
                        .refine(objectIdValidation, {
                            message: "Invalid product id"
                        }),

                    quantity: z
                        .number()
                        .positive("Quantity must be greater than 0"),

                    unitPrice: z
                        .number()
                        .positive("Unit price must be greater than 0")
                })
            )
            .min(1, "At least one product is required"),

        note: z
            .string()
            .max(500)
            .optional()
    })
};
export const getSaleByIdSchema = {
    params: z.object({
        id: generalRules.id
    })
}


export const updateSupplierSchema = {
    params: z.object({
        id: generalRules.id
    }),
    // body: createSupplierSchema.body.safeExtend({}).optional()
    body: z.object({
        companyName: z.string().min(2).max(100).optional(),
        contactPerson: z.string().min(2).max(100).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(10).max(15).optional(),
        address: z.string().max(200).optional(),
        note: z.string().max(200).optional()
    })
}
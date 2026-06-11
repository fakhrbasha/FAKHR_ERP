import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
import mongoose from "mongoose";


export const createSalesReturnSchema = {
    body: z.object({
        saleId: z.string(),

        items: z.array(
            z.object({
                productId: z.string(),

                quantity: z
                    .number()
                    .positive(),

                reason: z
                    .string()
                    .optional()
            })
        ).min(1),

        note: z.string().optional()
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
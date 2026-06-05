import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const createSupplierSchema = {
    body: z.object({
        companyName: z.string().min(2).max(100),
        contactPerson: z.string().min(2).max(100),
        email: z.string().email().optional(),
        phone: z.string().min(10).max(15),
        address: z.string().max(200).optional(),
        note: z.string().max(200).optional()
    })

}

export const getSupplierByIdSchema = {
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
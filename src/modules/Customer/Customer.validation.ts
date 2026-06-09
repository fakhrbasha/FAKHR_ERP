import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const createCustomerSchema = {
    body: z.object({
        name: z.string().min(3),
        phone: z.string().min(10),
        address: z.string().min(3),
        note: z.string().optional()
    })
}
export const getCustomerByIdSchema = {
    params: z.object({
        id: generalRules.id
    })
}


export const updateCustomerSchema = {
    params: z.object({
        id: generalRules.id
    }),
    // body: createSupplierSchema.body.safeExtend({}).optional()
    body: z.object({
        name: z.string().min(3).optional(),
        phone: z.string().min(10).optional(),
        address: z.string().min(3).optional(),
        note: z.string().optional()
    })
}
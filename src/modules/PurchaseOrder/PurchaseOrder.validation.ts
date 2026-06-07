import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const createPurchaseOrderSchema = {
    body: z.object({
        supplierId: z.string(),

        items: z.array(
            z.object({
                materialId: z.string(),
                colorId: z.string(),
                quantity: z.number().positive(),
                unitPrice: z.number().positive()
            })
        ).min(1),

        notes: z.string().optional()
    })
}
export const approveOrderSchema = {
    params: z.object({
        id: generalRules.id,
    })
}
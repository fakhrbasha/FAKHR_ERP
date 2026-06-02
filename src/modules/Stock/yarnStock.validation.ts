import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const addYarnStockSchema = {

    body: z.object({
        materialId: generalRules.id,
        colorId: generalRules.id,
        quantity: z.number().nonnegative(),
        minQuantity: z.number().nonnegative(),
    })


}
export const updateYarnStockSchema = {
    params: z.object({
        id: generalRules.id,
    }),
    body: z.object({
        name: z.string().optional(),
        hexCode: z.string().optional(),
    })

}

export const increaseYarnStockSchema = {
    params: z.object({
        id: generalRules.id,
    }),
    body: z.object({
        quantity: z.number().nonnegative(),
    })
}

export const decreaseYarnStockSchema = {
    params: z.object({
        id: generalRules.id,
    }),
    body: z.object({
        quantity: z.number().nonnegative(),
    })
}

export const historyOfYarnStockSchema = {
    params: z.object({
        id: generalRules.id,
    }),
}
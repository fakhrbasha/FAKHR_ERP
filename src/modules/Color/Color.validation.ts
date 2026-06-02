import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const addColorSchema = {
    body: z.object({
        name: z.string(),
        hexCode: z.string(),
    })

}
export const updateColorSchema = {
    params: z.object({
        id: generalRules.id,
    }),
    body: z.object({
        name: z.string().optional(),
        hexCode: z.string().optional(),
    })

}
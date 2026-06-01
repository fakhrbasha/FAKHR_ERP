import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
import { UnitEnum } from '../../common/enums/material.enum'
export const addMaterialSchema = {
    body: z.object({
        name: z.string().min(2).max(100),
        description: z.string().optional(),
        code: z.string().min(1).optional(),
        unit: z.enum(UnitEnum),
    })

}
export const getMaterialSchemaById = {
    params: z.object({
        id: generalRules.id,
    })
}

export const updateMaterialSchema = {
    params: z.object({
        id: generalRules.id
    }),

    // body: addMaterialSchema.body.safeExtend({}).optional()
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        code: z.string().optional(),
        unit: z.string().optional()
    })
}
import { Types } from 'mongoose'
import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const createUserSchema = {
    body: z.object({
        fullName: z.string(),
        salary: z.number(),
        phone: z.string(),
        role: z.string(),
        shiftId: generalRules.id
    })
    ,
    params: z.object({
        departmentId: generalRules.id
    })
}

export const getEmpById = {
    params: z.object({
        id: generalRules.id
    })
}
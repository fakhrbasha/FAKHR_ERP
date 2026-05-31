import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
export const createDepartmentSchema = {
    body: z.object({
        name: z.string(),
    })

}
export const getDeptSchemaById = {
    params: z.object({
        id: generalRules.id,
    })

}
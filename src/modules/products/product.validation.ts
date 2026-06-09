import { z } from 'zod'
import { generalRules } from '../../common/utils/generalRules'
import { ProductSize } from '../../DB/models/product.model'
export const createProductSchema = {
    body: z.object({
        name: z.string(),
        sku: z.string(),
        description: z.string().optional(),
        category: z.string(),
        sellingPrice: z.string(),
        image: z.string().optional(),
        // isActive: z.boolean(),
        availableSizes: z.array(z.nativeEnum(ProductSize)),
        availableColors: z.string().array(),
        quantity: z.string(),
        // imagePublicId: z.string()
    })

}

export const getProductByIdSchema = {
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
// export const editProductSchema = {
//     params: z.object({
//         id: generalRules.id
//     }),
//     body: createProductSchema.body.partial()
//     // body: createSupplierSchema.body.safeExtend({}).optional()
//     // body: z.object({
//     //     name: z.string(),
//     //     sku: z.string(),
//     //     description: z.string().optional(),
//     //     category: z.string(),
//     //     sellingPrice: z.string(),
//     //     image: z.string().optional(),
//     //     isActive: z.boolean().optional(),
//     //     availableSizes: z.array(z.nativeEnum(ProductSize)),
//     //     availableColors: z.string().array(),
//     //     quantity: z.string(),

//     //     // imagePublicId: z.string()
//     // })
// }

export const editProductSchema = {
    params: z.object({
        id: generalRules.id
    }),
    body: z.object({
        name: z.string().optional(),
        sku: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        sellingPrice: z.string().optional(),
        image: z.string().optional(),
        isActive: z.boolean().optional(),
        availableSizes: z.array(z.nativeEnum(ProductSize)).optional(),
        availableColors: z.array(z.string()).optional(),
        quantity: z.string().optional()
    })
}
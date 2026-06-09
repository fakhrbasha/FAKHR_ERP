import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import productService from "./product.service";
import { validation } from "../../common/middleware/validation";
import * as productValidation from "./product.validation";
import { multer_host } from "../../common/middleware/multer";
import { imageTypes } from "../../common/enums/multer.enum";
const productRouter = Router()

productRouter.post('/add-product',
    multer_host({ custom_type: imageTypes }).single("image"),
    authentication,
    validation(productValidation.createProductSchema),
    productService.addProduct)


productRouter.get('/', authentication, productService.getProducts)

productRouter.put(
    '/edit-product/:id',
    multer_host({ custom_type: imageTypes }).single("image"),
    authentication,
    validation(productValidation.editProductSchema),
    productService.updateProduct
)


productRouter.get('/:id', authentication, validation(productValidation.getProductByIdSchema), productService.getProductById)
productRouter.delete('/:id', authentication, validation(productValidation.getProductByIdSchema), productService.deleteProduct)


export default productRouter
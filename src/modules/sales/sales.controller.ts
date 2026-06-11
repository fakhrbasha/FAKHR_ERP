import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import salesService from "./sales.service";
import { validation } from "../../common/middleware/validation";
import * as salesValidation from "./sales.validation";
const salesRouter = Router()

salesRouter.post('/', authentication, validation(salesValidation.createSaleSchema), salesService.createSaleOrder)
salesRouter.get('/', authentication, salesService.getSalesOrders)
salesRouter.get('/:id', authentication, validation(salesValidation.getSaleByIdSchema), salesService.getSaleById)

export default salesRouter
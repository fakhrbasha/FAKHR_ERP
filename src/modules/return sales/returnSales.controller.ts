import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import returnSalesService from "./returnSales.service";
import { validation } from "../../common/middleware/validation";
import * as returnSalesValidation from "./returnSales.validation";
const returnSalesRouter = Router()

returnSalesRouter.post('/', authentication, validation(returnSalesValidation.createSalesReturnSchema), returnSalesService.createSalesReturn)
returnSalesRouter.get('/', authentication, returnSalesService.getReturnSalesOrders)
returnSalesRouter.get('/:id', authentication, validation(returnSalesValidation.getSaleByIdSchema), returnSalesService.getReturnSaleById)

export default returnSalesRouter
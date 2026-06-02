import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import { validation } from "../../common/middleware/validation";
import * as yarnStockValidation from "./stockTransaction.validation";
import YarnStockService from "./stockTransaction.service";
const StockTransactionRouter = Router({ mergeParams: true })

StockTransactionRouter.get("/", authentication, YarnStockService.getAllStockTransaction)
StockTransactionRouter.post("/in", authentication,
    validation(yarnStockValidation.increaseYarnStockSchema),
    YarnStockService.increaseYarnStock)
StockTransactionRouter.post("/out",
    authentication, validation(yarnStockValidation.decreaseYarnStockSchema),
    YarnStockService.decreaseYarnStock)


StockTransactionRouter.get("/history", authentication, validation(yarnStockValidation.historyOfYarnStockSchema), YarnStockService.historyOfStock)


export default StockTransactionRouter
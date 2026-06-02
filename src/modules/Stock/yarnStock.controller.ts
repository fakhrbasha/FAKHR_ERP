import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import { validation } from "../../common/middleware/validation";
import * as yarnStockValidation from "./yarnStock.validation";
import YarnStockService from "./yarnStock.service";
import StockTransactionRouter from "../stock transaction/stockTransaction.controller";
const yarnStockRouter = Router()
yarnStockRouter.use("/transaction/:stockId/", StockTransactionRouter)
yarnStockRouter.post("/create", authentication, validation(yarnStockValidation.addYarnStockSchema), YarnStockService.createYarnStock)
yarnStockRouter.get("/", authentication, YarnStockService.getAllYarnStock)
// yarnStockRouter.post("/in/:id", authentication, validation(yarnStockValidation.increaseYarnStockSchema), YarnStockService.increaseYarnStock)
// yarnStockRouter.post("/out/:id", authentication, validation(yarnStockValidation.decreaseYarnStockSchema), YarnStockService.decreaseYarnStock)
// yarnStockRouter.get("/history/:id", authentication, validation(yarnStockValidation.historyOfYarnStockSchema), YarnStockService.historyOfYarnStock)
yarnStockRouter.delete("/:id", authentication, YarnStockService.deleteYarnStock)

yarnStockRouter.get("/:id", authentication, YarnStockService.getYarnStockById)


export default yarnStockRouter
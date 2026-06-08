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

yarnStockRouter.delete("/:id", authentication, YarnStockService.deleteYarnStock)

yarnStockRouter.get("/:id", authentication, YarnStockService.getYarnStockById)


export default yarnStockRouter
import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import reportService from "./Reports.service";
import { validation } from "../../common/middleware/validation";
import * as reportValidation from "./supplier.validation";
const reportsRouter = Router()

reportsRouter.get("/expenses", authentication, reportService.getExpenseReport)
reportsRouter.get("/attendance", authentication, reportService.getAttendanceReport)
reportsRouter.get("/low-stock", authentication, reportService.getLowStockReport)
reportsRouter.get("/purchase-orders", authentication, reportService.getPurchaseOrdersReport)



export default reportsRouter
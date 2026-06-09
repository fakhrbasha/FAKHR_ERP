import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import dashboardService from "./dashboard.service";
import { validation } from "../../common/middleware/validation";
import * as dashboardValidation from "./supplier.validation";
const dashboardRouter = Router()

dashboardRouter.get('/state', authentication, dashboardService.getStats)
export default dashboardRouter
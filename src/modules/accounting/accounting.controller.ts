import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import accountingService from "./accounting.service";
import { validation } from "../../common/middleware/validation";
import * as accountingValidation from "./accounting.validation";
import { authorization } from "../../common/middleware/authorization";
import { RoleEnum } from "../../common/enums/user.enum";
const accountingRouter = Router()

accountingRouter.get(
    "/summary",
    authentication,
    authorization(RoleEnum.ADMIN),
    accountingService.getAccountingSummary
);
accountingRouter.get(
    "/monthly-report",
    authentication,
    authorization(RoleEnum.ADMIN),
    accountingService.getMonthlyReport
);
export default accountingRouter
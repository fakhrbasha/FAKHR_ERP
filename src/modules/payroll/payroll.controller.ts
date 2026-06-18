import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import payrollService from "./payroll.service";
import { validation } from "../../common/middleware/validation";
import * as payrollValidation from "./payroll.validation";
const payrollRouter = Router({ mergeParams: true })

payrollRouter.post('/', authentication, validation(payrollValidation.createPayrollSchema), payrollService.createEmployeePayment)
payrollRouter.get(
    "/:employeeId/summary",
    authentication,
    payrollService.getEmployeePaymentSummary
);
payrollRouter.get(
    "/:employeeId/payrolls",
    authentication,
    payrollService.getEmployeeById
);
export default payrollRouter
import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import expensesService from "./expenses.service";
import { validation } from "../../common/middleware/validation";
import * as expensesValidation from "./expenses.validation";
const expensesRouter = Router()

expensesRouter.post('/', authentication, validation(expensesValidation.createExpenseSchema), expensesService.addExpenses)
expensesRouter.get('/', authentication, expensesService.getExpenses)
expensesRouter.get('/:id', authentication, validation(expensesValidation.getExpenseByIdSchema), expensesService.getExpenseById)
expensesRouter.put('/:id', authentication, validation(expensesValidation.updateExpenseSchema), expensesService.updateExpense)
expensesRouter.delete('/:id', authentication, validation(expensesValidation.getExpenseByIdSchema), expensesService.deleteExpense)

export default expensesRouter
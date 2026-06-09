import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import expensesService from "./expenses.service";
import { validation } from "../../common/middleware/validation";
import * as expensesValidation from "./expenses.validation";
const expensesRouter = Router()

expensesRouter.post('/add-expense', authentication, validation(expensesValidation.createExpenseSchema), expensesService.addExpenses)
expensesRouter.get('/', authentication, expensesService.getExpenses)
expensesRouter.get('/:id', authentication, validation(expensesValidation.getExpenseByIdSchema), expensesService.getExpenseById)
expensesRouter.put('/update-expense/:id', authentication, validation(expensesValidation.updateExpenseSchema), expensesService.updateExpense)
expensesRouter.delete('/delete-expense/:id', authentication, validation(expensesValidation.getExpenseByIdSchema), expensesService.deleteExpense)

export default expensesRouter
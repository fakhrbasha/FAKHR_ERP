import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import expensesModel, { IExpenses } from "../models/expenses.model";


class ExpensesRepository extends BaseRepository<IExpenses> {
    constructor(protected readonly model: Model<IExpenses> = expensesModel) {
        super(model)
    }
}

export default ExpensesRepository
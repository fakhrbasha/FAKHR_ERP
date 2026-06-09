import mongoose, { HydratedDocument, Types, Schema } from "mongoose"

export interface IExpenses {
    title: string,
    amount: number,
    category: string,
    expenseDate: Date,
    note?: string,
    createdBy: Types.ObjectId

}

const expensesSchema = new mongoose.Schema<IExpenses>({

    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        required: true
    },
    expenseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    note: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})

const ExpensesModel = mongoose.models.Expenses || mongoose.model<IExpenses>("Expenses", expensesSchema)

export default ExpensesModel;
export type ExpensesDocument = HydratedDocument<IExpenses>;
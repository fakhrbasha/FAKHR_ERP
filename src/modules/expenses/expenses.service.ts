import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"
import ExpensesRepository from "../../DB/repository/expenses.repository"
import { IExpenses } from "../../DB/models/expenses.model"



class SupplierService {




    private readonly _expenseModel = new ExpensesRepository()


    addExpenses = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const {
            title,
            amount,
            category,
            expenseDate,
            note
        }: IExpenses = req.body;

        if (amount <= 0) {
            throw new AppError(
                "Amount must be greater than zero",
                400
            );
        }

        const expense = await this._expenseModel.create({
            title,
            amount,
            category,
            expenseDate,
            note,
            createdBy: req.user._id
        });

        return successResponse({
            res,
            status: 201,
            message: "Expense Added Successfully",
            data: expense
        });
    }

    getExpenses = async (req: Request,
        res: Response,
        next: NextFunction) => {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const searchQuery = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
            : {};

        const expenses = await this._expenseModel.paginate({
            page, limit, search: searchQuery
        })
        successResponse({ res, status: 200, message: "Expenses retrieved successfully", data: expenses });



    }
    getExpenseById = async (req: Request,
        res: Response,
        next: NextFunction) => {

        const { id } = req.params
        const expense = await this._expenseModel.findOne({
            filter: { _id: id }
        })
        if (!expense) {
            throw new AppError("Expense Not Found", 404)
        }
        successResponse({ res, status: 200, message: "Expenses retrieved successfully", data: expense });



    }
    deleteExpense = async (req: Request,
        res: Response,
        next: NextFunction) => {

        const { id } = req.params
        const expense = await this._expenseModel.findOne({
            filter: { _id: id }
        })
        if (!expense) {
            throw new AppError("Expense Not Found", 404)
        }
        await this._expenseModel.delete(expense._id)
        successResponse({ res, status: 200, message: "Expenses deleted successfully" });



    }
    updateExpense = async (req: Request,
        res: Response,
        next: NextFunction) => {

        const { id } = req.params
        const {
            title,
            amount,
            category,
            expenseDate,
            note
        }: IExpenses = req.body;

        if (amount <= 0) {
            throw new AppError(
                "Amount must be greater than zero",
                400
            );
        }

        const updateData: any = {};
        if (title !== undefined) {
            updateData.title = title;
        }
        if (amount !== undefined) {
            updateData.amount = amount;
        }
        if (category !== undefined) {
            updateData.category = category;
        }
        if (expenseDate !== undefined) {
            updateData.expenseDate = expenseDate;
        }
        if (note !== undefined) {
            updateData.note = note;
        }



        const expense = await this._expenseModel.findOne({
            filter: { _id: id }
        })
        if (!expense) {
            throw new AppError("Expense Not Found", 404)
        }

        const updateExpense = await this._expenseModel.update(
            { _id: id },
            updateData
        )


        successResponse({ res, status: 200, message: "Expense Updated successfully", data: updateExpense })




    }

}

export default new SupplierService()
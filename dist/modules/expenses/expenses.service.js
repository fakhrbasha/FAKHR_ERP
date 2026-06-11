"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const success_response_1 = require("../../common/utils/success.response");
const expenses_repository_1 = __importDefault(require("../../DB/repository/expenses.repository"));
class ExpensesService {
    _expenseModel = new expenses_repository_1.default();
    addExpenses = async (req, res, next) => {
        const { title, amount, category, expenseDate, note } = req.body;
        if (amount <= 0) {
            throw new global_error_handling_1.AppError("Amount must be greater than zero", 400);
        }
        const expense = await this._expenseModel.create({
            title,
            amount,
            category,
            expenseDate,
            note,
            createdBy: req.user._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 201,
            message: "Expense Added Successfully",
            data: expense
        });
    };
    getExpenses = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
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
        });
        (0, success_response_1.successResponse)({ res, status: 200, message: "Expenses retrieved successfully", data: expenses });
    };
    getExpenseById = async (req, res, next) => {
        const { id } = req.params;
        const expense = await this._expenseModel.findOne({
            filter: { _id: id }
        });
        if (!expense) {
            throw new global_error_handling_1.AppError("Expense Not Found", 404);
        }
        (0, success_response_1.successResponse)({ res, status: 200, message: "Expenses retrieved successfully", data: expense });
    };
    deleteExpense = async (req, res, next) => {
        const { id } = req.params;
        const expense = await this._expenseModel.findOne({
            filter: { _id: id }
        });
        if (!expense) {
            throw new global_error_handling_1.AppError("Expense Not Found", 404);
        }
        await this._expenseModel.delete(expense._id);
        (0, success_response_1.successResponse)({ res, status: 200, message: "Expenses deleted successfully" });
    };
    updateExpense = async (req, res, next) => {
        const { id } = req.params;
        const { title, amount, category, expenseDate, note } = req.body;
        if (amount <= 0) {
            throw new global_error_handling_1.AppError("Amount must be greater than zero", 400);
        }
        const updateData = {};
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
        });
        if (!expense) {
            throw new global_error_handling_1.AppError("Expense Not Found", 404);
        }
        const updateExpense = await this._expenseModel.update({ _id: id }, updateData);
        (0, success_response_1.successResponse)({ res, status: 200, message: "Expense Updated successfully", data: updateExpense });
    };
}
exports.default = new ExpensesService();

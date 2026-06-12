"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../../common/utils/success.response");
const customer_repository_1 = __importDefault(require("../../DB/repository/customer.repository"));
const sales_repository_1 = __importDefault(require("../../DB/repository/sales.repository"));
const returnSales_repository_1 = __importDefault(require("../../DB/repository/returnSales.repository"));
const expenses_repository_1 = __importDefault(require("../../DB/repository/expenses.repository"));
class SalesService {
    _customerModel = new customer_repository_1.default();
    _saleModel = new sales_repository_1.default();
    _expenseModel = new expenses_repository_1.default();
    _returnSalesModel = new returnSales_repository_1.default();
    getAccountingSummary = async (req, res, next) => {
        const sales = await this._saleModel.find({ filter: {} });
        const returnSale = await this._returnSalesModel.find({ filter: {} });
        const expense = await this._expenseModel.find({ filter: {} });
        const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalReturns = returnSale.reduce((sum, item) => sum + item.refundAmount, 0);
        const netSales = totalSales - totalReturns;
        const totalExpenses = expense.reduce((sum, expense) => sum + expense.amount, 0);
        const netProfit = netSales - totalExpenses;
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Accounting summary retrieved successfully",
            data: {
                totalSales,
                totalReturns,
                netSales,
                totalExpenses,
                netProfit
            }
        });
    };
    getMonthlyReport = async (req, res, next) => {
        const sales = await this._saleModel.find({
            filter: {}
        });
        const returns = await this._returnSalesModel.find({
            filter: {}
        });
        const expenses = await this._expenseModel.find({
            filter: {}
        });
        const report = {};
        for (const sale of sales) {
            const month = new Date(sale.createdAt)
                .toISOString()
                .slice(0, 7);
            if (!report[month]) {
                report[month] = {
                    sales: 0,
                    returns: 0,
                    expenses: 0
                };
            }
            report[month].sales +=
                sale.totalAmount;
        }
        for (const item of returns) {
            const month = new Date(item.createdAt)
                .toISOString()
                .slice(0, 7);
            if (!report[month]) {
                report[month] = {
                    sales: 0,
                    returns: 0,
                    expenses: 0
                };
            }
            report[month].returns +=
                item.refundAmount;
        }
        for (const expense of expenses) {
            const month = new Date(expense.expenseDate)
                .toISOString()
                .slice(0, 7);
            if (!report[month]) {
                report[month] = {
                    sales: 0,
                    returns: 0,
                    expenses: 0
                };
            }
            report[month].expenses +=
                expense.amount;
        }
        const result = Object.entries(report)
            .map(([month, data]) => ({
            month,
            sales: data.sales,
            returns: data.returns,
            expenses: data.expenses,
            profit: data.sales -
                data.returns -
                data.expenses
        }))
            .sort((a, b) => a.month.localeCompare(b.month));
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Monthly report retrieved successfully",
            data: result
        });
    };
}
exports.default = new SalesService();

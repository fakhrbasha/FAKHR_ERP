import { NextFunction, Request, Response } from "express"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import mongoose from "mongoose"
import { successResponse } from "../../common/utils/success.response"
import CustomerRepository from "../../DB/repository/customer.repository"
import { AppError } from "../../common/utils/global-error-handling"
import ProductRepository from "../../DB/repository/product.repository"
import { ISale } from "../../DB/models/sales.model"
import SalesRepository from "../../DB/repository/sales.repository"
import ReturnSalesRepository from "../../DB/repository/returnSales.repository"
import ExpensesRepository from "../../DB/repository/expenses.repository"



class SalesService {




    private readonly _customerModel = new CustomerRepository()
    private readonly _saleModel = new SalesRepository()
    private readonly _expenseModel = new ExpensesRepository()
    private readonly _returnSalesModel = new ReturnSalesRepository()


    getAccountingSummary = async (req: Request, res: Response, next: NextFunction) => {

        const sales = await this._saleModel.find({ filter: {} })

        const returnSale = await this._returnSalesModel.find({ filter: {} })

        const expense = await this._expenseModel.find({ filter: {} })


        const totalSales =
            sales.reduce(
                (sum, sale) =>
                    sum + sale.totalAmount,
                0
            );

        const totalReturns =
            returnSale.reduce(
                (sum, item) =>
                    sum + item.refundAmount, 0
            )

        const netSales = totalSales - totalReturns

        const totalExpenses = expense.reduce((sum, expense) => sum + expense.amount, 0)

        const netProfit = netSales - totalExpenses

        return successResponse({
            res,
            status: 200,
            message:
                "Accounting summary retrieved successfully",
            data: {
                totalSales,
                totalReturns,
                netSales,
                totalExpenses,
                netProfit
            }
        });
    }

    getMonthlyReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const sales = await this._saleModel.find({
            filter: {}
        });

        const returns = await this._returnSalesModel.find({
            filter: {}
        });

        const expenses = await this._expenseModel.find({
            filter: {}
        });

        const report: Record<
            string,
            {
                sales: number;
                returns: number;
                expenses: number;
            }
        > = {};

        for (const sale of sales) {

            const month =
                new Date(sale.createdAt!)
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

            const month =
                new Date(item.createdAt!)
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

            const month =
                new Date(expense.expenseDate)
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
                profit:
                    data.sales -
                    data.returns -
                    data.expenses
            }))
            .sort((a, b) =>
                a.month.localeCompare(b.month)
            );

        return successResponse({
            res,
            status: 200,
            message:
                "Monthly report retrieved successfully",
            data: result
        });
    };

}

export default new SalesService()
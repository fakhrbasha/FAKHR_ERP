import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"
import DepartmentRepository from "../../DB/repository/department.repository"
import CustomerRepository from "../../DB/repository/customer.repository"
import ProductRepository from "../../DB/repository/product.repository"
import MaterialRepository from "../../DB/repository/material.repository"
import purchaseOrderRepository from "../../DB/repository/purchaseOrder.repository"
import StockRepository from "../../DB/repository/stock.repository"
import ExpensesRepository from "../../DB/repository/expenses.repository"
import { PurchaseOrderStatus } from "../../DB/models/purchaseOrder.model"
import StockTransactionRepository from "../../DB/repository/stockTransaction.repository"



class SupplierService {




    private readonly _attendanceModel = new AttendanceRepository()
    private readonly _employeeModel = new EmployeeRepository()
    private readonly _departmentModel = new DepartmentRepository()
    private readonly _supplierModel = new SupplierRepository()
    private readonly _customerModel = new CustomerRepository()
    private readonly _productModel = new ProductRepository()
    private readonly _materialModel = new MaterialRepository()
    private readonly _purchaseOrderModel = new purchaseOrderRepository()
    private readonly _stockModel = new StockRepository()
    private readonly _expenseModel = new ExpensesRepository()
    private readonly _stockTransactionModel = new StockTransactionRepository()


    getExpenseReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { from, to, category } = req.query;

        const filter: any = {};

        // filter by category
        if (category) {
            filter.category = category;
        }

        // filter by date range
        if (from || to) {

            filter.expenseDate = {};

            if (from) {
                filter.expenseDate.$gte =
                    new Date(from as string);
            }

            if (to) {
                filter.expenseDate.$lte =
                    new Date(to as string);
            }
        }

        const expenses =
            await this._expenseModel.find({
                filter,
                options: {
                    sort: {
                        expenseDate: -1
                    }
                }
            });

        const totalExpenses =
            expenses.reduce(
                (sum, expense) =>
                    sum + expense.amount,
                0
            );

        return successResponse({
            res,
            status: 200,
            message:
                "Expense report retrieved successfully",
            data: {
                totalExpenses,
                count: expenses.length,
                expenses
            }
        });
    };

    getAttendanceReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { employeeId, from, to } = req.query;

        const filter: any = {};

        if (employeeId) {
            filter.employeeId = employeeId;
        }

        if (from || to) {

            filter.date = {};

            if (from) {
                filter.date.$gte =
                    new Date(from as string);
            }

            if (to) {
                filter.date.$lte =
                    new Date(to as string);
            }
        }

        const attendance =
            await this._attendanceModel.find({
                filter,
                options: {
                    populate: [
                        {
                            path: "employeeId",
                            select: "fullName role"
                        }
                    ],
                    sort: {
                        date: -1
                    }
                }
            });

        const totalPresent =
            attendance.filter(
                item => item.status === "present"
            ).length;

        const totalAbsent =
            attendance.filter(
                item => item.status === "absent"
            ).length;

        const totalLate =
            attendance.filter(
                item => item.status === "late"
            ).length;

        const totalOvertime =
            attendance.reduce(
                (sum, item) =>
                    sum + (item.overTimeHours || 0),
                0
            );

        return successResponse({
            res,
            status: 200,
            message:
                "Attendance report retrieved successfully",
            data: {
                totalPresent,
                totalAbsent,
                totalLate,
                totalOvertime,
                records: attendance
            }
        });
    };
    getLowStockReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const stocks =
            await this._stockModel.find({
                filter: {
                    $expr: {
                        $lte: [
                            "$quantity",
                            "$minQuantity"
                        ]
                    }
                },
                options: {
                    populate: [
                        {
                            path: "materialId",
                            select: "name code"
                        },
                        {
                            path: "colorId",
                            select: "name hexCode"
                        }
                    ]
                }
            });

        return successResponse({
            res,
            status: 200,
            message:
                "Low stock report retrieved successfully",
            data: {
                count: stocks.length,
                stocks
            }
        });
    };
    getPurchaseOrdersReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { status, supplierId, from, to } = req.query;
        // GET /reports/purchase-orders?status=APPROVED

        // GET /reports/purchase-orders?status=RECEIVED

        // GET /reports/purchase-orders?supplierId=686

        // GET /reports/purchase-orders?from=2026-01-01&to=2026-12-31
        const filter: any = {};

        if (status) {
            filter.status = status;
        }

        if (supplierId) {
            filter.supplierId = supplierId;
        }

        if (from || to) {

            filter.createdAt = {};

            if (from) {
                filter.createdAt.$gte =
                    new Date(from as string);
            }

            if (to) {
                filter.createdAt.$lte =
                    new Date(to as string);
            }
        }

        const orders =
            await this._purchaseOrderModel.find({
                filter,
                options: {
                    populate: [
                        {
                            path: "supplierId",
                            select:
                                "companyName contactPerson"
                        }
                    ]
                }
            });

        const totalAmount =
            orders.reduce(
                (sum, order) =>
                    sum + order.totalAmount,
                0
            );

        const approvedOrders =
            orders.filter(
                order =>
                    order.status ===
                    PurchaseOrderStatus.APPROVED
            ).length;

        const receivedOrders =
            orders.filter(
                order =>
                    order.status ===
                    PurchaseOrderStatus.RECEIVED
            ).length;

        const cancelledOrders =
            orders.filter(
                order =>
                    order.status ===
                    PurchaseOrderStatus.CANCELLED
            ).length;

        return successResponse({
            res,
            status: 200,
            message:
                "Purchase orders report retrieved successfully",
            data: {
                totalOrders: orders.length,
                approvedOrders,
                receivedOrders,
                cancelledOrders,
                totalAmount,
                orders
            }
        });
    };

    getStockTransactionsReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const {
            stockId,
            type,
            from,
            to
        } = req.query;

        const filter: any = {};

        if (stockId) {
            filter.stockId = stockId;
        }

        if (type) {
            filter.type = type;
        }

        if (from || to) {

            filter.createdAt = {};

            if (from) {
                filter.createdAt.$gte =
                    new Date(from as string);
            }

            if (to) {
                filter.createdAt.$lte =
                    new Date(to as string);
            }
        }

        const transactions =
            await this._stockTransactionModel.find({
                filter,
                options: {
                    populate: [
                        {
                            path: "stockId"
                        },
                        {
                            path: "createdBy",
                            select:
                                "firstName lastName email"
                        }
                    ],
                    sort: {
                        createdAt: -1
                    }
                }
            });

        const totalIn =
            transactions
                .filter(t => t.type === "IN")
                .reduce(
                    (sum, t) =>
                        sum + t.quantity,
                    0
                );

        const totalOut =
            transactions
                .filter(t => t.type === "OUT")
                .reduce(
                    (sum, t) =>
                        sum + t.quantity,
                    0
                );

        const totalAdjustment =
            transactions
                .filter(
                    t =>
                        t.type === "ADJUSTMENT"
                )
                .reduce(
                    (sum, t) =>
                        sum + t.quantity,
                    0
                );

        return successResponse({
            res,
            status: 200,
            message:
                "Stock transactions report retrieved successfully",
            data: {
                totalIn,
                totalOut,
                totalAdjustment,
                count:
                    transactions.length,
                transactions
            }
        });
    };
}

export default new SupplierService()
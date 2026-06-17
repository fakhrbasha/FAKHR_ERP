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

        if (category) {
            filter.category = category;
        }

        if (from || to) {
            filter.expenseDate = {};

            if (from) {
                const fromDate = new Date(from as string);
                if (isNaN(fromDate.getTime())) {
                    throw new AppError("Invalid from date", 400);
                }
                filter.expenseDate.$gte = fromDate;
            }

            if (to) {
                const toDate = new Date(to as string);
                if (isNaN(toDate.getTime())) {
                    throw new AppError("Invalid to date", 400);
                }
                filter.expenseDate.$lte = toDate;
            }
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const expensesResult = await this._expenseModel.paginate({
            page,
            limit,
            search: {
                ...filter
            },
            sort: {
                expenseDate: -1
            }
        });

        const expenses = expensesResult.data;

        const totalExpenses = expenses.reduce(
            (sum: number, expense: any) =>
                sum + (expense.amount || 0),
            0
        );

        return successResponse({
            res,
            status: 200,
            message: "Expense report retrieved successfully",
            data: {
                totalExpenses,
                count: expenses.length,
                meta: expensesResult.meta,
                expenses
            }
        });
    };
    getAttendanceReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { employeeId, fromDate, toDate } = req.query;

        const filter: any = {};

        // ================= employee filter =================
        if (employeeId) {
            if (!mongoose.Types.ObjectId.isValid(employeeId as string)) {
                throw new AppError("Invalid employee id", 400);
            }
            filter.employeeId = new mongoose.Types.ObjectId(employeeId as string);
        }

        // ================= date filter =================
        if (fromDate && toDate) {
            filter.date = {
                $gte: new Date(fromDate as string),
                $lte: new Date(toDate as string)
            };
        }

        const attendance = await this._attendanceModel.find({
            filter,
            options: {
                populate: {
                    path: "employeeId",
                    select: "fullName salary role"
                }
            }
        });

        // ================= SUMMARY =================
        let totalWorkedHours = 0;
        let totalOvertime = 0;
        let totalMissing = 0;
        let presentDays = 0;
        let lateDays = 0;
        let absentDays = 0;

        for (const record of attendance) {
            totalWorkedHours += record.workedHours || 0;
            totalOvertime += record.overtimeHours || 0;
            totalMissing += record.missingHours || 0;

            if (record.status === "present") presentDays++;
            if (record.status === "late") lateDays++;
            if (record.status === "absent") absentDays++;
        }

        return res.status(200).json({
            success: true,
            message: "Attendance report generated successfully",
            data: {
                summary: {
                    totalWorkedHours: Number(totalWorkedHours.toFixed(2)),
                    totalOvertime: Number(totalOvertime.toFixed(2)),
                    totalMissing: Number(totalMissing.toFixed(2)),
                    presentDays,
                    lateDays,
                    absentDays,
                    totalRecords: attendance.length
                },
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
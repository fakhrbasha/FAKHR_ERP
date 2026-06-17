"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const supplier_repository_1 = __importDefault(require("../../DB/repository/supplier.repository"));
const success_response_1 = require("../../common/utils/success.response");
const department_repository_1 = __importDefault(require("../../DB/repository/department.repository"));
const customer_repository_1 = __importDefault(require("../../DB/repository/customer.repository"));
const product_repository_1 = __importDefault(require("../../DB/repository/product.repository"));
const material_repository_1 = __importDefault(require("../../DB/repository/material.repository"));
const purchaseOrder_repository_1 = __importDefault(require("../../DB/repository/purchaseOrder.repository"));
const stock_repository_1 = __importDefault(require("../../DB/repository/stock.repository"));
const expenses_repository_1 = __importDefault(require("../../DB/repository/expenses.repository"));
const purchaseOrder_model_1 = require("../../DB/models/purchaseOrder.model");
const stockTransaction_repository_1 = __importDefault(require("../../DB/repository/stockTransaction.repository"));
class SupplierService {
    _attendanceModel = new attendance_repository_1.default();
    _employeeModel = new employee_repository_1.default();
    _departmentModel = new department_repository_1.default();
    _supplierModel = new supplier_repository_1.default();
    _customerModel = new customer_repository_1.default();
    _productModel = new product_repository_1.default();
    _materialModel = new material_repository_1.default();
    _purchaseOrderModel = new purchaseOrder_repository_1.default();
    _stockModel = new stock_repository_1.default();
    _expenseModel = new expenses_repository_1.default();
    _stockTransactionModel = new stockTransaction_repository_1.default();
    getExpenseReport = async (req, res, next) => {
        const { from, to, category } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (from || to) {
            filter.expenseDate = {};
            if (from) {
                const fromDate = new Date(from);
                if (isNaN(fromDate.getTime())) {
                    throw new global_error_handling_1.AppError("Invalid from date", 400);
                }
                filter.expenseDate.$gte = fromDate;
            }
            if (to) {
                const toDate = new Date(to);
                if (isNaN(toDate.getTime())) {
                    throw new global_error_handling_1.AppError("Invalid to date", 400);
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
        const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        return (0, success_response_1.successResponse)({
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
    getAttendanceReport = async (req, res, next) => {
        const { employeeId, fromDate, toDate } = req.query;
        const filter = {};
        if (employeeId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
                throw new global_error_handling_1.AppError("Invalid employee id", 400);
            }
            filter.employeeId = new mongoose_1.default.Types.ObjectId(employeeId);
        }
        if (fromDate && toDate) {
            filter.date = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
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
            if (record.status === "present")
                presentDays++;
            if (record.status === "late")
                lateDays++;
            if (record.status === "absent")
                absentDays++;
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
    getLowStockReport = async (req, res, next) => {
        const stocks = await this._stockModel.find({
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
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Low stock report retrieved successfully",
            data: {
                count: stocks.length,
                stocks
            }
        });
    };
    getPurchaseOrdersReport = async (req, res, next) => {
        const { status, supplierId, from, to } = req.query;
        const filter = {};
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
                    new Date(from);
            }
            if (to) {
                filter.createdAt.$lte =
                    new Date(to);
            }
        }
        const orders = await this._purchaseOrderModel.find({
            filter,
            options: {
                populate: [
                    {
                        path: "supplierId",
                        select: "companyName contactPerson"
                    }
                ]
            }
        });
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const approvedOrders = orders.filter(order => order.status ===
            purchaseOrder_model_1.PurchaseOrderStatus.APPROVED).length;
        const receivedOrders = orders.filter(order => order.status ===
            purchaseOrder_model_1.PurchaseOrderStatus.RECEIVED).length;
        const cancelledOrders = orders.filter(order => order.status ===
            purchaseOrder_model_1.PurchaseOrderStatus.CANCELLED).length;
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Purchase orders report retrieved successfully",
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
    getStockTransactionsReport = async (req, res, next) => {
        const { stockId, type, from, to } = req.query;
        const filter = {};
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
                    new Date(from);
            }
            if (to) {
                filter.createdAt.$lte =
                    new Date(to);
            }
        }
        const transactions = await this._stockTransactionModel.find({
            filter,
            options: {
                populate: [
                    {
                        path: "stockId"
                    },
                    {
                        path: "createdBy",
                        select: "firstName lastName email"
                    }
                ],
                sort: {
                    createdAt: -1
                }
            }
        });
        const totalIn = transactions
            .filter(t => t.type === "IN")
            .reduce((sum, t) => sum + t.quantity, 0);
        const totalOut = transactions
            .filter(t => t.type === "OUT")
            .reduce((sum, t) => sum + t.quantity, 0);
        const totalAdjustment = transactions
            .filter(t => t.type === "ADJUSTMENT")
            .reduce((sum, t) => sum + t.quantity, 0);
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Stock transactions report retrieved successfully",
            data: {
                totalIn,
                totalOut,
                totalAdjustment,
                count: transactions.length,
                transactions
            }
        });
    };
}
exports.default = new SupplierService();

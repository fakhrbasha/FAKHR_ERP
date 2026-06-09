"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
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
                filter.expenseDate.$gte =
                    new Date(from);
            }
            if (to) {
                filter.expenseDate.$lte =
                    new Date(to);
            }
        }
        const expenses = await this._expenseModel.find({
            filter,
            options: {
                sort: {
                    expenseDate: -1
                }
            }
        });
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Expense report retrieved successfully",
            data: {
                totalExpenses,
                count: expenses.length,
                expenses
            }
        });
    };
    getAttendanceReport = async (req, res, next) => {
        const { employeeId, from, to } = req.query;
        const filter = {};
        if (employeeId) {
            filter.employeeId = employeeId;
        }
        if (from || to) {
            filter.date = {};
            if (from) {
                filter.date.$gte =
                    new Date(from);
            }
            if (to) {
                filter.date.$lte =
                    new Date(to);
            }
        }
        const attendance = await this._attendanceModel.find({
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
        const totalPresent = attendance.filter(item => item.status === "present").length;
        const totalAbsent = attendance.filter(item => item.status === "absent").length;
        const totalLate = attendance.filter(item => item.status === "late").length;
        const totalOvertime = attendance.reduce((sum, item) => sum + (item.overTimeHours || 0), 0);
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Attendance report retrieved successfully",
            data: {
                totalPresent,
                totalAbsent,
                totalLate,
                totalOvertime,
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

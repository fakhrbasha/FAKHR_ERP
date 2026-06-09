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
    getStats = async (req, res, next) => {
        const employees = await this._employeeModel.count();
        const departments = await this._departmentModel.count();
        const suppliers = await this._supplierModel.count();
        const customers = await this._customerModel.count();
        const products = await this._productModel.count();
        const materials = await this._materialModel.count();
        const purchaseOrders = await this._purchaseOrderModel.count();
        const lowStockItems = await this._stockModel.count({
            filter: {
                $expr: {
                    $lte: [
                        "$quantity",
                        "$minQuantity"
                    ]
                }
            }
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Dashboard statistics retrieved successfully",
            data: {
                employees,
                departments,
                suppliers,
                customers,
                products,
                materials,
                purchaseOrders,
                lowStockItems
            }
        });
    };
}
exports.default = new SupplierService();

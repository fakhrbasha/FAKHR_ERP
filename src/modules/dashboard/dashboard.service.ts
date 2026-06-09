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
    getStats = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const employees =
            await this._employeeModel.count();

        const departments =
            await this._departmentModel.count();

        const suppliers =
            await this._supplierModel.count();

        const customers =
            await this._customerModel.count();

        const products =
            await this._productModel.count();

        const materials =
            await this._materialModel.count();

        const purchaseOrders =
            await this._purchaseOrderModel.count();

        const lowStockItems =
            await this._stockModel.count({
                filter: {
                    $expr: {
                        $lte: [
                            "$quantity",
                            "$minQuantity"
                        ]
                    }
                }
            });

        return successResponse({
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

export default new SupplierService()
import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"
import CustomerRepository from "../../DB/repository/customer.repository"
import { ICustomer } from "../../DB/models/customer.model"



class SupplierService {




    private readonly _customerModel = new CustomerRepository()



    addCustomer = async (req: Request, res: Response, next: NextFunction) => {
        const { name, phone, address, note }: ICustomer = req.body

        const customerExist = await this._customerModel.findOne({
            filter: {
                phone
            }
        })

        if (customerExist) {
            throw new AppError("Customer Already Exist")
        }

        const customer = await this._customerModel.create({
            name, phone, address, note
        })


        successResponse({ res, status: 201, message: "customer created successfully", data: customer })
    }
    getCustomers = async (req: Request, res: Response, next: NextFunction) => {

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

        const customers = await this._customerModel.paginate({
            page,
            limit,
            search: {
                searchQuery
            }
        })
        successResponse({ res, status: 200, message: "customers fetched successfully", data: customers })
    }
    getCustomerById = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params
        const customer = await this._customerModel.findOne({
            filter: {
                _id: id
            }
        })
        if (!customer) {
            throw new AppError("Customer Not Found", 404)
        }


        successResponse({ res, status: 200, message: "customers fetched successfully", data: customer })
    }
    deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params
        const customer = await this._customerModel.findOne({
            filter: {
                _id: id
            }
        })
        if (!customer) {
            throw new AppError("Customer Not Found", 404)
        }

        await this._customerModel.delete(customer._id)
        successResponse({ res, status: 200, message: "customers deleted successfully" })
    }
    updateCustomer = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        const { name, phone, address, note } = req.body

        const updateData: any = {};
        if (name !== undefined) {
            updateData.name = name;
        }
        if (phone !== undefined) {
            updateData.phone = phone;
        }
        if (address !== undefined) {
            updateData.address = address;
        }
        if (note !== undefined) {
            updateData.note = note;
        }

        const orConditions = [];
        if (phone !== undefined) {
            orConditions.push({ phone });
        }

        if (orConditions.length > 0) {
            const existingCustomer = await this._customerModel.findOne({
                filter: {
                    _id: { $ne: id },
                    $or: orConditions
                }
            });

            if (existingCustomer) {
                throw new AppError(
                    "Customer with the same phone already exists",
                    400
                );
            }
        }

        const updatedCustomer = await this._customerModel.update(
            { _id: id },
            updateData
        )


        successResponse({ res, status: 200, message: "customers Updated successfully", data: updatedCustomer })
    }




}

export default new SupplierService()
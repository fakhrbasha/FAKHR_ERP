import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"



class AttendanceService {




    private readonly _attendanceModel = new AttendanceRepository()
    private readonly _employeeModel = new EmployeeRepository()
    private readonly _supplierModel = new SupplierRepository()

    addSupplier = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { companyName, contactPerson, email, phone, address, note } = req.body;

        const existingSupplier = await this._supplierModel.findOne({
            filter: {
                $or: [
                    { email },
                    { phone }
                ]
            }
        });


        if (existingSupplier) {
            throw new AppError("Supplier with the same email or phone already exists", 400);
        }

        const newSupplier = await this._supplierModel.create({
            companyName,
            contactPerson,
            email,
            phone,
            address,
            note
        });

        successResponse({ res, status: 201, message: "Supplier added successfully", data: newSupplier })
    }

    getAllSuppliers = async (req: Request, res: Response, next: NextFunction) => {
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


        const suppliers = await this._supplierModel.paginate({ page, limit, search: searchQuery });
        successResponse({ res, status: 200, message: "Suppliers retrieved successfully", data: suppliers });
    }

    getSupplierById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (Array.isArray(id)) {
            throw new AppError("Invalid supplier ID", 400);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid supplier ID", 400);
        }

        const supplier = await this._supplierModel.findOne({
            filter: {
                _id: id
            }
        });

        if (!supplier) {
            throw new AppError("Supplier not found", 404);
        }

        successResponse({ res, status: 200, message: "Supplier retrieved successfully", data: supplier });
    }

    updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { companyName, contactPerson, email, phone, address, note } = req.body;

        const updateData: any = {};

        if (companyName !== undefined) {
            updateData.companyName = companyName;
        }

        if (contactPerson !== undefined) {
            updateData.contactPerson = contactPerson;
        }

        if (email !== undefined) {
            updateData.email = email;
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

        if (email !== undefined) {
            orConditions.push({ email });
        }

        if (phone !== undefined) {
            orConditions.push({ phone });
        }

        if (orConditions.length > 0) {
            const existingSupplier = await this._supplierModel.findOne({
                filter: {
                    _id: { $ne: id },
                    $or: orConditions
                }
            });

            if (existingSupplier) {
                throw new AppError(
                    "Supplier with the same email or phone already exists",
                    400
                );
            }
        }

        const updatedSupplier = await this._supplierModel.update(
            { _id: id },
            updateData
        );

        if (!updatedSupplier) {
            throw new AppError("Failed to update supplier", 500);
        }

        successResponse({
            res,
            status: 200,
            message: "Supplier updated successfully",
            data: updatedSupplier
        });
    };

    deleteSupplier = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deletedSupplier = await this._supplierModel.findOne({
            filter: { _id: id }
        });

        if (!deletedSupplier) {
            throw new AppError("Supplier not found", 404);
        }

        await this._supplierModel.delete(deletedSupplier._id);

        if (!deletedSupplier) {
            throw new AppError("Failed to delete supplier", 500);
        }
        successResponse({
            res,
            status: 200,
            message: "Supplier deleted successfully",
        });
    }


}

export default new AttendanceService()
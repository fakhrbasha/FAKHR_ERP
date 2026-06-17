import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import EmployeeRepository from "../../DB/repository/employee.repository";
import DepartmentRepository from "../../DB/repository/department.repository";
import ShiftRepository from "../../DB/repository/shift.repository";

import { AppError } from "../../common/utils/global-error-handling";

class EmployeeService {
    private readonly _employeeModel = new EmployeeRepository();
    private readonly _departmentModel = new DepartmentRepository();
    private readonly _shiftModel = new ShiftRepository();

    // ================= CREATE EMPLOYEE =================
    createEmployee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const {
            fullName,
            salary,
            phone,
            role,
            shiftId
        } = req.body;

        const { departmentId } = req.params;

        if (!departmentId) {
            throw new AppError("Department Id Is Required", 400);
        }
        if (Array.isArray(departmentId)) {

            throw new AppError("Invalid employee id", 400);

        }
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            throw new AppError("Invalid Department Id", 400);
        }

        if (shiftId && !mongoose.Types.ObjectId.isValid(shiftId)) {
            throw new AppError("Invalid Shift Id", 400);
        }

        const department = await this._departmentModel.findOne({
            filter: { _id: departmentId }
        });

        if (!department) {
            throw new AppError("Department not found", 404);
        }

        if (shiftId) {
            const shift = await this._shiftModel.findById(shiftId);
            if (!shift) {
                throw new AppError("Shift not found", 404);
            }
        }

        const employeeExist = await this._employeeModel.findOne({
            filter: { phone }
        });

        if (employeeExist) {
            throw new AppError("Employee already exists", 400);
        }

        const employee = await this._employeeModel.create({
            fullName,
            salary,
            phone,
            role,
            departmentId: new mongoose.Types.ObjectId(departmentId),
            shiftId: shiftId
                ? new mongoose.Types.ObjectId(shiftId)
                : undefined
        } as any);

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        });
    };

    getEmployees = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search?.toString();

        const searchQuery = search
            ? {
                fullName: {
                    $regex: search,
                    $options: "i"
                }
            }
            : {};

        const data = await this._employeeModel.paginate({
            page,
            limit,
            search: searchQuery,
            sort: { createdAt: -1 },
            populate: [
                {
                    path: "departmentId",
                    select: "name"
                },
                {
                    path: "shiftId",
                    select: "name startTime endTime workingHours"
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Employees retrieved successfully",
            data
        });
    };

    getEmployeeById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;
        if (Array.isArray(id)) {

            throw new AppError("Invalid employee id", 400);

        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid employee id", 400);
        }

        const employee = await this._employeeModel.findOne({
            filter: { _id: id },
            options: {
                populate: [
                    {
                        path: "departmentId"
                    },
                    {
                        path: "shiftId"
                    }
                ]
            }
        });

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Employee retrieved successfully",
            data: employee
        });
    };

    updateEmployee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;

        const {
            fullName,
            salary,
            phone,
            role,
            departmentId,
            shiftId
        } = req.body;
        if (Array.isArray(id)) {

            throw new AppError("Invalid employee id", 400);

        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid employee id", 400);
        }

        if (departmentId && !mongoose.Types.ObjectId.isValid(departmentId)) {
            throw new AppError("Invalid department id", 400);
        }

        if (shiftId && !mongoose.Types.ObjectId.isValid(shiftId)) {
            throw new AppError("Invalid shift id", 400);
        }

        const employee = await this._employeeModel.findOne({
            filter: { _id: id }
        });

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        const updated = await this._employeeModel.update(
            { _id: id },
            {
                fullName,
                salary,
                phone,
                role,
                departmentId,
                shiftId
            } as any
        );

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updated
        });
    };

    deleteEmployee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;
        if (Array.isArray(id)) {

            throw new AppError("Invalid employee id", 400);

        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid employee id", 400);
        }

        const employee = await this._employeeModel.findOne({
            filter: { _id: id }
        });

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        await this._employeeModel.delete(id as any);

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    };
}

export default new EmployeeService();
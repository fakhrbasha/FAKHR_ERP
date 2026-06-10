import { NextFunction, Request, Response } from "express"
import EmployeeRepository from "../../DB/repository/employee.repository"
import { AppError } from "../../common/utils/global-error-handling"
import { IEmployee } from "../../DB/models/employee.model"
import DepartmentRepository from "../../DB/repository/department.repository"
import mongoose from "mongoose"



class EmployeeService {




    private readonly _employeeModel = new EmployeeRepository()
    private readonly _departmentModel = new DepartmentRepository()

    createEmployee = async (req: Request, res: Response, next: NextFunction) => {
        const { fullName, salary, phone, role } = req.body
        const { departmentId } = req.params;

        if (!departmentId) {
            throw new AppError(
                "Department Id Is Required",
                400
            );
        }

        const departmentObjectId =
            new mongoose.Types.ObjectId(
                departmentId as string
            );

        const department =
            await this._departmentModel.findOne({
                filter: {
                    _id: departmentId
                }
            })

        if (!department) {
            throw new AppError(
                "Department not found",
                404
            )
        }

        const employeeExist = await this._employeeModel.findOne({ filter: { phone } })
        if (employeeExist) {
            throw new AppError("user already exist", 400)
        }



        const employee =
            await this._employeeModel.create({

                fullName,

                salary,

                phone,

                role,

                departmentId:
                    departmentObjectId
            });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        })


    }
    getEmployees = async (req: Request, res: Response, next: NextFunction) => {
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

        const data = await this._employeeModel.paginate({ page, limit, search: searchQuery })
        return res.status(200).json({
            status: true,
            message: "Employees retrieved successfully",
            data: {
                data
            }
        })
    }

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
        const employee =
            await this._employeeModel.findOne({
                filter: { _id: id }
            });

        if (!employee) {
            throw new AppError(
                "Employee not found",
                404
            );
        }
        console.log(id)
        return res.status(200).json({
            success: true,
            message: "Employee retrieved successfully",
            data: employee
        });
    };

    // delete 
    deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params

        if (Array.isArray(id)) {
            throw new AppError("Invalid employee id", 400);
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid employee id", 400);
        }
        const employee =
            await this._employeeModel.findOne({
                filter: { _id: id }
            });

        if (!employee) {
            throw new AppError(
                "Employee not found",
                404
            );
        }

        await this._employeeModel.delete(employee._id)

        return res.status(200).json({
            status: true,
            message: "delete employee successfully"
        })


    }
    // update
    updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params

        const { fullName, salary, phone, role, departmentId } = req.body
        if (Array.isArray(id)) {
            throw new AppError("Invalid employee id", 400);
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid employee id", 400);
        }
        const employee =
            await this._employeeModel.findOne({
                filter: { _id: id }
            });

        if (!employee) {
            throw new AppError("Employee not found", 404)
        }

        const updatedEmployee = await this._employeeModel.update(
            { _id: id },
            {
                fullName,
                salary,
                phone,
                role,
                departmentId
            }
        );
        if (!updatedEmployee) {
            throw new AppError(
                "Employee not found",
                404
            );
        }
        return res.status(201).json({
            status: true,
            message: "update employee success",
            data: updatedEmployee
        })



    }

}

export default new EmployeeService()
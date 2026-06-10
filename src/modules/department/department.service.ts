import { NextFunction, Request, Response } from "express"
import EmployeeRepository from "../../DB/repository/employee.repository"
import DepartmentRepository from "../../DB/repository/department.repository"
import { AppError } from "../../common/utils/global-error-handling"



class DepartmentService {




    private readonly _departmentMode = new DepartmentRepository()

    createDepartment = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body

        const isDepartment = await this._departmentMode.findOne({ filter: { name } })

        if (isDepartment) {

            throw new AppError(
                "Department already exists",
                409
            );
        }
        const department = await this._departmentMode.create({
            name
        })

        return res.status(201).json({

            success: true,

            message:
                "Department created successfully",

            data: department
        });
    }

    getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
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

        const departments = await this._departmentMode.paginate(
            {
                page, limit, search: searchQuery
            }
        )
        return res.status(200).json({
            success: true,
            message: "departments retrieved successfully",
            data: {
                departments
            }
        })
    }
    // getDepartmentById

    getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params

        const isDepartment = await this._departmentMode.findOne({
            filter: { _id: id }
        })

        if (isDepartment) {
            throw new AppError("Department Id not exist", 409)
        }

        return res.status(200).json({
            success: true,
            message: "Department Retrieved Successfully",
            data: isDepartment
        })
    }

    // updateDepartment
    updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const { name } = req.body
        const isExist = await this._departmentMode.findOne({ filter: { _id: id } })
        if (!isExist) {
            throw new AppError("Department Id not exist", 409)
        }

        const department = await this._departmentMode.update({ id }, { name })
        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: {
                department
            }
        })
    }

    deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const isExist = await this._departmentMode.findOne({ filter: { _id: id } })
        if (!isExist) {
            throw new AppError("Department Id not exist", 409)
        }

        // await this._departmentMode
        await this._departmentMode.delete(isExist._id)
        return res.status(200).json({
            success: true,
            message: "Department deleted successfully",
        })

    }
    // deleteDepartment



}

export default new DepartmentService()
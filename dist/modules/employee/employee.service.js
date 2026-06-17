"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const department_repository_1 = __importDefault(require("../../DB/repository/department.repository"));
const shift_repository_1 = __importDefault(require("../../DB/repository/shift.repository"));
const global_error_handling_1 = require("../../common/utils/global-error-handling");
class EmployeeService {
    _employeeModel = new employee_repository_1.default();
    _departmentModel = new department_repository_1.default();
    _shiftModel = new shift_repository_1.default();
    createEmployee = async (req, res, next) => {
        const { fullName, salary, phone, role, shiftId } = req.body;
        const { departmentId } = req.params;
        if (!departmentId) {
            throw new global_error_handling_1.AppError("Department Id Is Required", 400);
        }
        if (Array.isArray(departmentId)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(departmentId)) {
            throw new global_error_handling_1.AppError("Invalid Department Id", 400);
        }
        if (shiftId && !mongoose_1.default.Types.ObjectId.isValid(shiftId)) {
            throw new global_error_handling_1.AppError("Invalid Shift Id", 400);
        }
        const department = await this._departmentModel.findOne({
            filter: { _id: departmentId }
        });
        if (!department) {
            throw new global_error_handling_1.AppError("Department not found", 404);
        }
        if (shiftId) {
            const shift = await this._shiftModel.findById(shiftId);
            if (!shift) {
                throw new global_error_handling_1.AppError("Shift not found", 404);
            }
        }
        const employeeExist = await this._employeeModel.findOne({
            filter: { phone }
        });
        if (employeeExist) {
            throw new global_error_handling_1.AppError("Employee already exists", 400);
        }
        const employee = await this._employeeModel.create({
            fullName,
            salary,
            phone,
            role,
            departmentId: new mongoose_1.default.Types.ObjectId(departmentId),
            shiftId: shiftId
                ? new mongoose_1.default.Types.ObjectId(shiftId)
                : undefined
        });
        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee
        });
    };
    getEmployees = async (req, res, next) => {
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
    getEmployeeById = async (req, res, next) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
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
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Employee retrieved successfully",
            data: employee
        });
    };
    updateEmployee = async (req, res, next) => {
        const { id } = req.params;
        const { fullName, salary, phone, role, departmentId, shiftId } = req.body;
        if (Array.isArray(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (departmentId && !mongoose_1.default.Types.ObjectId.isValid(departmentId)) {
            throw new global_error_handling_1.AppError("Invalid department id", 400);
        }
        if (shiftId && !mongoose_1.default.Types.ObjectId.isValid(shiftId)) {
            throw new global_error_handling_1.AppError("Invalid shift id", 400);
        }
        const employee = await this._employeeModel.findOne({
            filter: { _id: id }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        const updated = await this._employeeModel.update({ _id: id }, {
            fullName,
            salary,
            phone,
            role,
            departmentId,
            shiftId
        });
        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updated
        });
    };
    deleteEmployee = async (req, res, next) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        const employee = await this._employeeModel.findOne({
            filter: { _id: id }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        await this._employeeModel.delete(id);
        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    };
}
exports.default = new EmployeeService();

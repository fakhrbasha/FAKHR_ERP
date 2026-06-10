"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const department_repository_1 = __importDefault(require("../../DB/repository/department.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
class EmployeeService {
    _employeeModel = new employee_repository_1.default();
    _departmentModel = new department_repository_1.default();
    createEmployee = async (req, res, next) => {
        const { fullName, salary, phone, role } = req.body;
        const { departmentId } = req.params;
        if (!departmentId) {
            throw new global_error_handling_1.AppError("Department Id Is Required", 400);
        }
        const departmentObjectId = new mongoose_1.default.Types.ObjectId(departmentId);
        const department = await this._departmentModel.findOne({
            filter: {
                _id: departmentId
            }
        });
        if (!department) {
            throw new global_error_handling_1.AppError("Department not found", 404);
        }
        const employeeExist = await this._employeeModel.findOne({ filter: { phone } });
        if (employeeExist) {
            throw new global_error_handling_1.AppError("user already exist", 400);
        }
        const employee = await this._employeeModel.create({
            fullName,
            salary,
            phone,
            role,
            departmentId: departmentObjectId
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
        const searchQuery = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
            : {};
        const data = await this._employeeModel.paginate({ page, limit, search: searchQuery });
        return res.status(200).json({
            status: true,
            message: "Employees retrieved successfully",
            data: {
                data
            }
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
            filter: { _id: id }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        console.log(id);
        return res.status(200).json({
            success: true,
            message: "Employee retrieved successfully",
            data: employee
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
        await this._employeeModel.delete(employee._id);
        return res.status(200).json({
            status: true,
            message: "delete employee successfully"
        });
    };
    updateEmployee = async (req, res, next) => {
        const { id } = req.params;
        const { fullName, salary, phone, role, departmentId } = req.body;
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
        const updatedEmployee = await this._employeeModel.update({ _id: id }, {
            fullName,
            salary,
            phone,
            role,
            departmentId
        });
        if (!updatedEmployee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        return res.status(201).json({
            status: true,
            message: "update employee success",
            data: updatedEmployee
        });
    };
}
exports.default = new EmployeeService();

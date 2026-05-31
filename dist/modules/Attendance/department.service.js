"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const department_repository_1 = __importDefault(require("../../DB/repository/department.repository"));
const global_error_handling_1 = require("../../common/utils/global-error-handling");
class DepartmentService {
    _departmentMode = new department_repository_1.default();
    createDepartment = async (req, res, next) => {
        const { name } = req.body;
        const isDepartment = await this._departmentMode.findOne({ filter: { name } });
        if (isDepartment) {
            throw new global_error_handling_1.AppError("Department already exists", 409);
        }
        const department = await this._departmentMode.create({
            name
        });
        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department
        });
    };
    getAllDepartments = async (req, res, next) => {
        const departments = await this._departmentMode.find({ filter: {} });
        return res.status(200).json({
            success: true,
            message: "departments retrieved successfully",
            data: {
                departments
            }
        });
    };
    getDepartmentById = async (req, res, next) => {
        const { id } = req.params;
        const isDepartment = await this._departmentMode.findOne({
            filter: { _id: id }
        });
        if (isDepartment) {
            throw new global_error_handling_1.AppError("Department Id not exist", 409);
        }
        return res.status(200).json({
            success: true,
            message: "Department Retrieved Successfully",
            data: isDepartment
        });
    };
    updateDepartment = async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;
        const isExist = await this._departmentMode.findOne({ filter: { _id: id } });
        if (!isExist) {
            throw new global_error_handling_1.AppError("Department Id not exist", 409);
        }
        const department = await this._departmentMode.update({ id }, { name });
        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: {
                department
            }
        });
    };
    deleteDepartment = async (req, res, next) => {
        const { id } = req.params;
        const isExist = await this._departmentMode.findOne({ filter: { _id: id } });
        if (!isExist) {
            throw new global_error_handling_1.AppError("Department Id not exist", 409);
        }
        await this._departmentMode.delete(isExist._id);
        return res.status(200).json({
            success: true,
            message: "Department deleted successfully",
        });
    };
}
exports.default = new DepartmentService();

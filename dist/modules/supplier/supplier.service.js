"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const supplier_repository_1 = __importDefault(require("../../DB/repository/supplier.repository"));
const success_response_1 = require("../../common/utils/success.response");
class SupplierService {
    _attendanceModel = new attendance_repository_1.default();
    _employeeModel = new employee_repository_1.default();
    _supplierModel = new supplier_repository_1.default();
    addSupplier = async (req, res, next) => {
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
            throw new global_error_handling_1.AppError("Supplier with the same email or phone already exists", 400);
        }
        const newSupplier = await this._supplierModel.create({
            companyName,
            contactPerson,
            email,
            phone,
            address,
            note
        });
        (0, success_response_1.successResponse)({ res, status: 201, message: "Supplier added successfully", data: newSupplier });
    };
    getAllSuppliers = async (req, res, next) => {
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
        (0, success_response_1.successResponse)({ res, status: 200, message: "Suppliers retrieved successfully", data: suppliers });
    };
    getSupplierById = async (req, res, next) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new global_error_handling_1.AppError("Invalid supplier ID", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new global_error_handling_1.AppError("Invalid supplier ID", 400);
        }
        const supplier = await this._supplierModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!supplier) {
            throw new global_error_handling_1.AppError("Supplier not found", 404);
        }
        (0, success_response_1.successResponse)({ res, status: 200, message: "Supplier retrieved successfully", data: supplier });
    };
    updateSupplier = async (req, res, next) => {
        const { id } = req.params;
        const { companyName, contactPerson, email, phone, address, note } = req.body;
        const updateData = {};
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
                throw new global_error_handling_1.AppError("Supplier with the same email or phone already exists", 400);
            }
        }
        const updatedSupplier = await this._supplierModel.update({ _id: id }, updateData);
        if (!updatedSupplier) {
            throw new global_error_handling_1.AppError("Failed to update supplier", 500);
        }
        (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Supplier updated successfully",
            data: updatedSupplier
        });
    };
    deleteSupplier = async (req, res, next) => {
        const { id } = req.params;
        const deletedSupplier = await this._supplierModel.findOne({
            filter: { _id: id }
        });
        if (!deletedSupplier) {
            throw new global_error_handling_1.AppError("Supplier not found", 404);
        }
        await this._supplierModel.delete(deletedSupplier._id);
        if (!deletedSupplier) {
            throw new global_error_handling_1.AppError("Failed to delete supplier", 500);
        }
        (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Supplier deleted successfully",
        });
    };
}
exports.default = new SupplierService();

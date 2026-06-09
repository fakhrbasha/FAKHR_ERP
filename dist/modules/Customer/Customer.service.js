"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const success_response_1 = require("../../common/utils/success.response");
const customer_repository_1 = __importDefault(require("../../DB/repository/customer.repository"));
class SupplierService {
    _customerModel = new customer_repository_1.default();
    addCustomer = async (req, res, next) => {
        const { name, phone, address, note } = req.body;
        const customerExist = await this._customerModel.findOne({
            filter: {
                phone
            }
        });
        if (customerExist) {
            throw new global_error_handling_1.AppError("Customer Already Exist");
        }
        const customer = await this._customerModel.create({
            name, phone, address, note
        });
        (0, success_response_1.successResponse)({ res, status: 201, message: "customer created successfully", data: customer });
    };
    getCustomers = async (req, res, next) => {
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
        });
        (0, success_response_1.successResponse)({ res, status: 200, message: "customers fetched successfully", data: customers });
    };
    getCustomerById = async (req, res, next) => {
        const { id } = req.params;
        const customer = await this._customerModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!customer) {
            throw new global_error_handling_1.AppError("Customer Not Found", 404);
        }
        (0, success_response_1.successResponse)({ res, status: 200, message: "customers fetched successfully", data: customer });
    };
    deleteCustomer = async (req, res, next) => {
        const { id } = req.params;
        const customer = await this._customerModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!customer) {
            throw new global_error_handling_1.AppError("Customer Not Found", 404);
        }
        await this._customerModel.delete(customer._id);
        (0, success_response_1.successResponse)({ res, status: 200, message: "customers deleted successfully" });
    };
    updateCustomer = async (req, res, next) => {
        const { id } = req.params;
        const { name, phone, address, note } = req.body;
        const updateData = {};
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
                throw new global_error_handling_1.AppError("Customer with the same phone already exists", 400);
            }
        }
        const updatedCustomer = await this._customerModel.update({ _id: id }, updateData);
        (0, success_response_1.successResponse)({ res, status: 200, message: "customers Updated successfully", data: updatedCustomer });
    };
}
exports.default = new SupplierService();

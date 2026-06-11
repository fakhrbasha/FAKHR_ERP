"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../../common/utils/success.response");
const customer_repository_1 = __importDefault(require("../../DB/repository/customer.repository"));
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const product_repository_1 = __importDefault(require("../../DB/repository/product.repository"));
const sales_repository_1 = __importDefault(require("../../DB/repository/sales.repository"));
class SupplierService {
    _customerModel = new customer_repository_1.default();
    _saleModel = new sales_repository_1.default();
    _productModel = new product_repository_1.default();
    createSaleOrder = async (req, res, next) => {
        const { customerId, items, note } = req.body;
        const customer = await this._customerModel.findOne({
            filter: { _id: customerId }
        });
        if (!customer) {
            throw new global_error_handling_1.AppError("Customer not found", 404);
        }
        let totalAmount = 0;
        for (const item of items) {
            const product = await this._productModel.findOne({
                filter: { _id: item.productId }
            });
            if (!product) {
                throw new global_error_handling_1.AppError("Product not found", 404);
            }
            if (product.quantity < item.quantity) {
                throw new global_error_handling_1.AppError(`${product.name} stock is not enough`, 400);
            }
            await this._productModel.update({ _id: product._id }, {
                quantity: product.quantity - item.quantity
            });
            totalAmount = item.quantity * item.unitPrice;
        }
        const sale = await this._saleModel.create({
            customerId,
            items,
            totalAmount,
            note,
            createdBy: req.user._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 201,
            message: "Sale created successfully",
            data: sale
        });
    };
    getSalesOrders = async (req, res, next) => {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const searchQuery = req.query.search
            ? {
                customerId: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
            : {};
        const sales = await this._saleModel.paginate({
            page, limit, search: searchQuery
        });
        (0, success_response_1.successResponse)({ res, message: "Sales Orders Fetched Successfully", data: sales });
    };
    getSaleById = async (req, res, next) => {
        const { id } = req.params;
        const sale = await this._saleModel.findOne({
            filter: { _id: id }
        });
        if (!sale) {
            throw new global_error_handling_1.AppError("Sale Order Not Found", 404);
        }
        (0, success_response_1.successResponse)({ res, message: "Order Fetched", data: sale });
    };
}
exports.default = new SupplierService();

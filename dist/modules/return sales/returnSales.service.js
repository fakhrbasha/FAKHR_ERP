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
const returnSales_repository_1 = __importDefault(require("../../DB/repository/returnSales.repository"));
class ReturnSale {
    _customerModel = new customer_repository_1.default();
    _saleModel = new sales_repository_1.default();
    _productModel = new product_repository_1.default();
    _returnSaleModel = new returnSales_repository_1.default();
    createSalesReturn = async (req, res, next) => {
        const { saleId, items, note } = req.body;
        const sale = await this._saleModel.findOne({
            filter: { _id: saleId }
        });
        if (!sale) {
            throw new global_error_handling_1.AppError("Sale not found", 404);
        }
        let refundAmount = 0;
        const previousReturns = await this._returnSaleModel.find({
            filter: { saleId }
        });
        for (const item of items) {
            const soldItem = sale.items.find((saleItem) => saleItem.productId.toString() ===
                item.productId);
            if (!soldItem) {
                throw new global_error_handling_1.AppError("Product was not sold in this sale", 400);
            }
            const totalReturned = previousReturns.reduce((sum, salesReturn) => {
                const returnedItem = salesReturn.items.find((returnedItem) => returnedItem.productId.toString() ===
                    item.productId);
                return (sum +
                    (returnedItem
                        ? returnedItem.quantity
                        : 0));
            }, 0);
            if (totalReturned + item.quantity >
                soldItem.quantity) {
                throw new global_error_handling_1.AppError(`Maximum return quantity is ${soldItem.quantity - totalReturned}`, 400);
            }
            const product = await this._productModel.findOne({
                filter: {
                    _id: item.productId
                }
            });
            if (!product) {
                throw new global_error_handling_1.AppError("Product not found", 404);
            }
            await this._productModel.update({ _id: product._id }, {
                quantity: product.quantity +
                    item.quantity
            });
            refundAmount +=
                item.quantity *
                    soldItem.unitPrice;
        }
        const salesReturn = await this._returnSaleModel.create({
            saleId,
            items,
            refundAmount,
            note,
            createdBy: req.user._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 201,
            message: "Sales return created successfully",
            data: salesReturn
        });
    };
    getReturnSalesOrders = async (req, res, next) => {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const sales = await this._returnSaleModel.paginate({
            page,
            limit,
            populate: [
                {
                    path: "saleId",
                },
                {
                    path: "createdBy",
                    select: "firstName lastName email"
                }
            ]
        });
        (0, success_response_1.successResponse)({ res, message: "Sales Orders Fetched Successfully", data: sales });
    };
    getReturnSaleById = async (req, res, next) => {
        const { id } = req.params;
        const sale = await this._returnSaleModel.findOne({
            filter: { _id: id }, options: {
                populate: [
                    {
                        path: "saleId"
                    },
                    {
                        path: "createdBy",
                        select: "firstName lastName email"
                    }
                ]
            }
        });
        if (!sale) {
            throw new global_error_handling_1.AppError("Return Sale Order Not Found", 404);
        }
        (0, success_response_1.successResponse)({ res, message: "return Order Fetched", data: sale });
    };
}
exports.default = new ReturnSale();

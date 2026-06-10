"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const supplier_repository_1 = __importDefault(require("../../DB/repository/supplier.repository"));
const success_response_1 = require("../../common/utils/success.response");
const purchaseOrder_model_1 = require("../../DB/models/purchaseOrder.model");
const material_repository_1 = __importDefault(require("../../DB/repository/material.repository"));
const color_repository_1 = __importDefault(require("../../DB/repository/color.repository"));
const purchaseOrder_repository_1 = __importDefault(require("../../DB/repository/purchaseOrder.repository"));
const stock_repository_1 = __importDefault(require("../../DB/repository/stock.repository"));
const stockTransaction_repository_1 = __importDefault(require("../../DB/repository/stockTransaction.repository"));
const stockTransaction_model_1 = require("../../DB/models/stockTransaction.model");
const notification_repository_1 = __importDefault(require("../../DB/repository/notification.repository"));
const email_event_1 = require("../../common/utils/email/email.event");
class PurchaseOrderService {
    _purchaseOrder = new purchaseOrder_repository_1.default();
    _materialModel = new material_repository_1.default();
    _colorModel = new color_repository_1.default();
    _supplierModel = new supplier_repository_1.default();
    _stockModel = new stock_repository_1.default();
    _stockTransactionModel = new stockTransaction_repository_1.default();
    _notificationModel = new notification_repository_1.default();
    createPurchaseOrder = async (req, res, next) => {
        const { supplierId, notes, items } = req.body;
        const supplier = await this._supplierModel.findOne({
            filter: { _id: supplierId }
        });
        if (!supplier) {
            throw new global_error_handling_1.AppError("supplier not found", 404);
        }
        if (!items?.length) {
            throw new global_error_handling_1.AppError("Items are required", 400);
        }
        let totalAmount = 0;
        for (const item of items) {
            const material = await this._materialModel.findOne({
                filter: { _id: item.materialId }
            });
            if (!material) {
                throw new global_error_handling_1.AppError(`Material not found: ${item.materialId}`, 404);
            }
            const color = await this._colorModel.findOne({
                filter: {
                    _id: item.colorId
                }
            });
            if (!color) {
                throw new global_error_handling_1.AppError(`Color not found: ${item.colorId}`, 404);
            }
            if (item.quantity <= 0) {
                throw new global_error_handling_1.AppError("Quantity must be greater than 0", 400);
            }
            if (item.unitPrice <= 0) {
                throw new global_error_handling_1.AppError("Unit price must be greater than 0", 400);
            }
            totalAmount += item.quantity * item.unitPrice;
        }
        const order = await this._purchaseOrder.create({
            supplierId,
            items,
            totalAmount,
            notes,
            status: purchaseOrder_model_1.PurchaseOrderStatus.PENDING,
            createdBy: req.user._id
        });
        email_event_1.eventEmitter.emit(email_event_1.NotificationEventEnum.PURCHASE_ORDER_CREATED, {
            orderId: order._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 201,
            message: "Purchase order created successfully",
            data: order
        });
    };
    getAllPurchaseOrders = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const purchaseOrders = await this._purchaseOrder.paginate({
            page,
            limit,
            populate: [
                {
                    path: "supplierId",
                    select: "companyName contactPerson phone"
                },
                {
                    path: "createdBy",
                    select: "firstName lastName email"
                },
                {
                    path: "items.materialId",
                    select: "name code"
                },
                {
                    path: "items.colorId",
                    select: "name hexCode"
                }
            ],
            sort: {
                createdAt: -1
            }
        });
        if (!purchaseOrders.data.length) {
            throw new global_error_handling_1.AppError("No purchase orders found", 404);
        }
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Purchase orders retrieved successfully",
            data: purchaseOrders
        });
    };
    getOrderById = async (req, res, next) => {
        const { id } = req.params;
        const order = await this._purchaseOrder.findOne({
            filter: {
                _id: id
            }, options: {
                populate: [
                    {
                        path: "items.materialId",
                        select: "name code"
                    },
                    {
                        path: "items.colorId",
                        select: "name hexCode"
                    },
                    {
                        path: "supplierId",
                        select: "companyName contactPerson"
                    },
                    {
                        path: "createdBy",
                        select: "firstName lastName email"
                    }
                ]
            }
        });
        if (!order) {
            throw new global_error_handling_1.AppError("Order Not Found", 404);
        }
        (0, success_response_1.successResponse)({ res, status: 200, message: "Purchase order Retrieved Success", data: order });
    };
    approveOrder = async (req, res, next) => {
        const { id } = req.params;
        const Order = await this._purchaseOrder.findOne({
            filter: { _id: id }
        });
        if (!Order) {
            throw new global_error_handling_1.AppError("Order not Found", 404);
        }
        if (Order.status == purchaseOrder_model_1.PurchaseOrderStatus.CANCELLED) {
            throw new global_error_handling_1.AppError("Cannot approve cancelled order", 400);
        }
        if (Order.status == purchaseOrder_model_1.PurchaseOrderStatus.APPROVED) {
            throw new global_error_handling_1.AppError("Order Already Approved", 400);
        }
        const updateOrder = await this._purchaseOrder.update({ _id: id }, {
            status: purchaseOrder_model_1.PurchaseOrderStatus.APPROVED
        });
        email_event_1.eventEmitter.emit(email_event_1.NotificationEventEnum.PURCHASE_ORDER_APPROVED, {
            orderId: Order._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Purchase order approved successfully",
            data: updateOrder
        });
    };
    cancelOrder = async (req, res, next) => {
        const { id } = req.params;
        const Order = await this._purchaseOrder.findOne({
            filter: { _id: id }
        });
        if (!Order) {
            throw new global_error_handling_1.AppError("Order not Found", 404);
        }
        if (Order.status === purchaseOrder_model_1.PurchaseOrderStatus.RECEIVED) {
            throw new global_error_handling_1.AppError("Cannot cancel received order", 400);
        }
        const updatedOrder = await this._purchaseOrder.update({ _id: id }, {
            status: purchaseOrder_model_1.PurchaseOrderStatus.CANCELLED
        });
        email_event_1.eventEmitter.emit(email_event_1.NotificationEventEnum.PURCHASE_ORDER_CANCELLED, {
            orderId: Order._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Purchase order cancelled successfully",
            data: updatedOrder
        });
    };
    receiveOrder = async (req, res, next) => {
        const { id } = req.params;
        const Order = await this._purchaseOrder.findOne({
            filter: { _id: id }
        });
        if (!Order) {
            throw new global_error_handling_1.AppError("Order not Found", 404);
        }
        if (Order.status !== purchaseOrder_model_1.PurchaseOrderStatus.APPROVED) {
            throw new global_error_handling_1.AppError("Order Must be Approved", 400);
        }
        for (const item of Order.items) {
            const stock = await this._stockModel.findOne({
                filter: {
                    materialId: item.materialId,
                    colorId: item.colorId
                }
            });
            let stockId;
            if (stock) {
                await this._stockModel.update({ _id: stock._id }, {
                    quantity: stock.quantity + item.quantity
                });
                stockId = stock._id;
            }
            else {
                const newStock = await this._stockModel.create({
                    materialId: item.materialId,
                    colorId: item.colorId,
                    quantity: item.quantity,
                    minQuantity: 10,
                    createdBy: req.user._id
                });
                stockId = newStock._id;
            }
            await this._stockTransactionModel.create({
                stockId,
                quantity: item.quantity,
                type: stockTransaction_model_1.TransactionStock_Enum.IN,
                reason: `Purchase Order #${Order._id}`,
                createdBy: req.user._id
            });
        }
        await this._purchaseOrder.update({ _id: id }, {
            status: purchaseOrder_model_1.PurchaseOrderStatus.RECEIVED
        });
        email_event_1.eventEmitter.emit(email_event_1.NotificationEventEnum.PURCHASE_ORDER_RECEIVED, {
            orderId: Order._id
        });
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Purchase order received successfully"
        });
    };
}
exports.default = new PurchaseOrderService();

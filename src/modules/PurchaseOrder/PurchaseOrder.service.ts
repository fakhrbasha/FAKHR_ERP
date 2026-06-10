import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"
import { IPurchaseOrder, PurchaseOrderStatus } from "../../DB/models/purchaseOrder.model"
import MaterialRepository from "../../DB/repository/material.repository"
import ColorRepository from "../../DB/repository/color.repository"
import purchaseOrderRepository from "../../DB/repository/purchaseOrder.repository"
import StockRepository from "../../DB/repository/stock.repository"
import StockTransactionRepository from "../../DB/repository/stockTransaction.repository"
import { TransactionStock_Enum } from "../../DB/models/stockTransaction.model"
import NotificationRepository from "../../DB/repository/notification.repository"
import { NotificationType } from "../../DB/models/notifications.model"
import { eventEmitter, NotificationEventEnum } from "../../common/utils/email/email.event"



class PurchaseOrderService {




    private readonly _purchaseOrder = new purchaseOrderRepository()
    private readonly _materialModel = new MaterialRepository()
    private readonly _colorModel = new ColorRepository()
    private readonly _supplierModel = new SupplierRepository()
    private readonly _stockModel = new StockRepository()
    private readonly _stockTransactionModel = new StockTransactionRepository()
    private readonly _notificationModel = new NotificationRepository()


    createPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { supplierId, notes, items }: IPurchaseOrder = req.body

        const supplier = await this._supplierModel.findOne({
            filter: { _id: supplierId }
        })
        if (!supplier) {
            throw new AppError("supplier not found", 404)
        }
        if (!items?.length) {
            throw new AppError(
                "Items are required",
                400
            );
        }

        let totalAmount = 0
        for (const item of items) {
            const material = await this._materialModel.findOne({
                filter: { _id: item.materialId }
            })
            if (!material) {
                throw new AppError(
                    `Material not found: ${item.materialId}`,
                    404
                );
            }
            const color =
                await this._colorModel.findOne({
                    filter: {
                        _id: item.colorId
                    }
                });

            if (!color) {
                throw new AppError(
                    `Color not found: ${item.colorId}`,
                    404
                );
            }
            if (item.quantity <= 0) {
                throw new AppError(
                    "Quantity must be greater than 0",
                    400
                );
            }

            if (item.unitPrice <= 0) {
                throw new AppError(
                    "Unit price must be greater than 0",
                    400
                );
            }
            totalAmount += item.quantity * item.unitPrice
        }

        const order = await this._purchaseOrder.create({
            supplierId,
            items,
            totalAmount,
            notes,
            status: PurchaseOrderStatus.PENDING,
            createdBy: req.user!._id
        })
        eventEmitter.emit(NotificationEventEnum.PURCHASE_ORDER_CREATED, {
            orderId: order._id
        })


        return successResponse({
            res,
            status: 201,
            message: "Purchase order created successfully",
            data: order
        });

    }

    getAllPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const purchaseOrders =
            await this._purchaseOrder.paginate({
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
            throw new AppError(
                "No purchase orders found",
                404
            );
        }

        return successResponse({
            res,
            status: 200,
            message: "Purchase orders retrieved successfully",
            data: purchaseOrders
        });
    }

    getOrderById = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params
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
        })
        if (!order) {
            throw new AppError("Order Not Found", 404)
        }

        successResponse({ res, status: 200, message: "Purchase order Retrieved Success", data: order })
    }


    approveOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params

        const Order = await this._purchaseOrder.findOne({
            filter: { _id: id }
        })
        if (!Order) {
            throw new AppError("Order not Found", 404)
        }
        if (Order.status == PurchaseOrderStatus.CANCELLED) {
            throw new AppError(
                "Cannot approve cancelled order",
                400
            );
        }
        if (Order.status == PurchaseOrderStatus.APPROVED) {
            throw new AppError(
                "Order Already Approved",
                400
            );
        }
        const updateOrder = await this._purchaseOrder.update({ _id: id }, {
            status: PurchaseOrderStatus.APPROVED
        })

        eventEmitter.emit(NotificationEventEnum.PURCHASE_ORDER_APPROVED, {
            orderId: Order._id
        })
        return successResponse({
            res,
            status: 200,
            message: "Purchase order approved successfully",
            data: updateOrder
        });
    }

    cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const Order = await this._purchaseOrder.findOne({
            filter: { _id: id }
        })
        if (!Order) {
            throw new AppError("Order not Found", 404)
        }
        if (Order.status === PurchaseOrderStatus.RECEIVED) {
            throw new AppError(
                "Cannot cancel received order",
                400
            );
        }
        const updatedOrder =
            await this._purchaseOrder.update(
                { _id: id },
                {
                    status: PurchaseOrderStatus.CANCELLED
                }
            );
        eventEmitter.emit(NotificationEventEnum.PURCHASE_ORDER_CANCELLED, {
            orderId: Order._id
        })
        return successResponse({
            res,
            status: 200,
            message: "Purchase order cancelled successfully",
            data: updatedOrder
        });

    }
    receiveOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const Order = await this._purchaseOrder.findOne({
            filter: { _id: id }
        })
        if (!Order) {
            throw new AppError("Order not Found", 404)
        }
        // must be approved 
        if (Order.status !== PurchaseOrderStatus.APPROVED) {
            throw new AppError("Order Must be Approved", 400)
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
                await this._stockModel.update(
                    { _id: stock._id },
                    {
                        quantity: stock.quantity + item.quantity
                    }
                );

                stockId = stock._id;
            } else {
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
                type: TransactionStock_Enum.IN,
                reason: `Purchase Order #${Order._id}`,
                createdBy: req.user._id
            });
        }

        await this._purchaseOrder.update(
            { _id: id },
            {
                status: PurchaseOrderStatus.RECEIVED
            }
        );
        eventEmitter.emit(NotificationEventEnum.PURCHASE_ORDER_RECEIVED, {
            orderId: Order._id
        })
        return successResponse({
            res,
            status: 200,
            message: "Purchase order received successfully"
        });

    }


}

export default new PurchaseOrderService()
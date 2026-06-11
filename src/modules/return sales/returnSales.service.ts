import { NextFunction, Request, Response } from "express"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import mongoose from "mongoose"
import { successResponse } from "../../common/utils/success.response"
import CustomerRepository from "../../DB/repository/customer.repository"
import { AppError } from "../../common/utils/global-error-handling"
import ProductRepository from "../../DB/repository/product.repository"
import { ISale } from "../../DB/models/sales.model"
import SalesRepository from "../../DB/repository/sales.repository"
import ReturnSalesRepository from "../../DB/repository/returnSales.repository"
import { ISalesReturn } from "../../DB/models/returnSale.model"



class ReturnSale {




    private readonly _customerModel = new CustomerRepository()
    private readonly _saleModel = new SalesRepository()
    private readonly _productModel = new ProductRepository()
    private readonly _returnSaleModel = new ReturnSalesRepository()

    createSalesReturn = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { saleId, items, note } = req.body;

        const sale = await this._saleModel.findOne({
            filter: { _id: saleId }
        });

        if (!sale) {
            throw new AppError(
                "Sale not found",
                404
            );
        }

        let refundAmount = 0;

        const previousReturns =
            await this._returnSaleModel.find({
                filter: { saleId }
            });

        for (const item of items) {

            const soldItem = sale.items.find(
                (saleItem: any) =>
                    saleItem.productId.toString() ===
                    item.productId
            );

            if (!soldItem) {
                throw new AppError(
                    "Product was not sold in this sale",
                    400
                );
            }

            const totalReturned =
                previousReturns.reduce(
                    (sum, salesReturn: any) => {

                        const returnedItem =
                            salesReturn.items.find(
                                (returnedItem: any) =>
                                    returnedItem.productId.toString() ===
                                    item.productId
                            );

                        return (
                            sum +
                            (returnedItem
                                ? returnedItem.quantity
                                : 0)
                        );
                    },
                    0
                );

            if (
                totalReturned + item.quantity >
                soldItem.quantity
            ) {
                throw new AppError(
                    `Maximum return quantity is ${soldItem.quantity - totalReturned
                    }`,
                    400
                );
            }

            const product =
                await this._productModel.findOne({
                    filter: {
                        _id: item.productId
                    }
                });

            if (!product) {
                throw new AppError(
                    "Product not found",
                    404
                );
            }

            await this._productModel.update(
                { _id: product._id },
                {
                    quantity:
                        product.quantity +
                        item.quantity
                }
            );

            refundAmount +=
                item.quantity *
                soldItem.unitPrice;
        }

        const salesReturn =
            await this._returnSaleModel.create({
                saleId,
                items,
                refundAmount,
                note,
                createdBy: req.user._id
            });

        return successResponse({
            res,
            status: 201,
            message:
                "Sales return created successfully",
            data: salesReturn
        });
    };
    getReturnSalesOrders = async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)


        const sales =
            await this._returnSaleModel.paginate({
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
        successResponse({ res, message: "Sales Orders Fetched Successfully", data: sales })
    }
    getReturnSaleById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const sale = await this._returnSaleModel.findOne({
            filter: { _id: id }, options: {
                populate: [
                    {
                        path: "saleId"
                    },
                    {
                        path: "createdBy",
                        select:
                            "firstName lastName email"
                    }
                ]
            }
        })
        if (!sale) {
            throw new AppError("Return Sale Order Not Found", 404)
        }

        successResponse({ res, message: "return Order Fetched", data: sale })
    }
}

export default new ReturnSale()
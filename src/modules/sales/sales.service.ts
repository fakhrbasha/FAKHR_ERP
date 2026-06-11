import { NextFunction, Request, Response } from "express"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import mongoose from "mongoose"
import { successResponse } from "../../common/utils/success.response"
import CustomerRepository from "../../DB/repository/customer.repository"
import { AppError } from "../../common/utils/global-error-handling"
import ProductRepository from "../../DB/repository/product.repository"
import { ISale } from "../../DB/models/sales.model"
import SalesRepository from "../../DB/repository/sales.repository"



class SalesService {




    private readonly _customerModel = new CustomerRepository()
    private readonly _saleModel = new SalesRepository()
    private readonly _productModel = new ProductRepository()

    createSaleOrder = async (req: Request, res: Response, next: NextFunction) => {
        const {
            customerId,
            items,
            note
        }: ISale = req.body;

        const customer = await this._customerModel.findOne({
            filter: { _id: customerId }
        })
        if (!customer) {
            throw new AppError(
                "Customer not found",
                404
            );
        }

        let totalAmount = 0

        for (const item of items) {
            const product = await this._productModel.findOne({
                filter: { _id: item.productId }
            })
            if (!product) {
                throw new AppError(
                    "Product not found",
                    404
                );
            }
            // check stock
            if (product.quantity < item.quantity) {
                throw new AppError(
                    `${product.name} stock is not enough`,
                    400
                );
            }

            await this._productModel.update({ _id: product._id }, {
                quantity: product.quantity - item.quantity
            })

            totalAmount = item.quantity * item.unitPrice

        }

        const sale = await this._saleModel.create({
            customerId,
            items,
            totalAmount,
            note,
            createdBy: req.user._id
        })
        return successResponse({
            res,
            status: 201,
            message: "Sale created successfully",
            data: sale
        });
    };
    getSalesOrders = async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)


        const sales = await this._saleModel.paginate({
            page, limit,
            populate: [
                {
                    path: "customerId",
                },
                {
                    path: "createdBy",
                    select:
                        "firstName lastName email"
                }
            ]
        })
        // if (!sales.data.length) {
        //     successResponse({ res, message: "No Orders Added" })
        // }

        successResponse({ res, message: "Sales Orders Fetched Successfully", data: sales })
    }
    getSaleById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const sale = await this._saleModel.findOne({
            filter: { _id: id },
            options: {
                populate: [
                    {
                        path: "customerId"
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
            throw new AppError("Sale Order Not Found", 404)
        }

        successResponse({ res, message: "Order Fetched", data: sale })
    }
}

export default new SalesService()
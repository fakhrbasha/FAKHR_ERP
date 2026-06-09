import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import AttendanceRepository from "../../DB/repository/attendance.repository"
import { IAttendance } from "../../DB/models/attendance.model"
import { attendanceStatus } from "../../common/enums/attendance.enum"
import EmployeeRepository from "../../DB/repository/employee.repository"
import mongoose from "mongoose"
import SupplierRepository from "../../DB/repository/supplier.repository"
import { successResponse } from "../../common/utils/success.response"
import ProductRepository from "../../DB/repository/product.repository"
import { IProduct } from "../../DB/models/product.model"
import cloudinary from "../../common/utils/cloudinary"
import streamifier from "streamifier";


class ProductService {




    private readonly _attendanceModel = new AttendanceRepository()
    private readonly _employeeModel = new EmployeeRepository()
    private readonly _supplierModel = new SupplierRepository()
    private readonly _productModel = new ProductRepository()

    addProduct = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const {
            name,
            sku,
            description,
            category,
            sellingPrice,
            availableSizes,
            availableColors,
            quantity
        }: IProduct = req.body;

        const isProductExist =
            await this._productModel.findOne({
                filter: {
                    sku
                }
            });

        if (isProductExist) {
            throw new AppError(
                "Product already exists",
                409
            );
        }

        if (!req.file) {
            throw new AppError(
                "Product image is required",
                400
            );
        }
        const uploadFromBuffer = (file: Express.Multer.File) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "Volcano/Products"
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };
        const result: any = await uploadFromBuffer(req.file);

        const { secure_url, public_id } = result;

        const product =
            await this._productModel.create({
                name,
                sku,
                description,
                category,
                sellingPrice,
                availableSizes,
                availableColors,
                quantity,
                image: secure_url,
                imagePublicId: public_id
            });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    };

    getProducts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {


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

        const products = await this._productModel.paginate({
            page,
            limit,
            search: {
                searchQuery
            }
        })
        successResponse({ res, status: 200, message: "Product Fetched Successfully", data: products })

        // const transactions =
        //     await this._stockTransactionModel.paginate({
        //         page,
        //         limit,
        //         search: {
        //             stockId
        //         },
        //         populate: [
        //             {
        //                 path: "createdBy",
        //                 select: "firstName lastName email"
        //             }
        //         ],
        //         sort: {
        //             createdAt: -1
        //         }
        //     });
    }

    getProductById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params
        const product = await this._productModel.findOne({
            filter: {
                _id: id
            }
        })
        if (!product) {
            throw new AppError("Product Not Found", 404)
        }

        successResponse({ res, message: "product Fetched Successfully", status: 200, data: product })

    }
    deleteProduct = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params
        const product = await this._productModel.findOne({
            filter: {
                _id: id
            }
        })
        if (!product) {
            throw new AppError("Product Not Found", 404)
        }

        await this._productModel.delete(product._id)

        successResponse({ res, message: "product deleted Successfully" })

    }


    updateProduct = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { id } = req.params;

        const product = await this._productModel.findOne({
            filter: {
                _id: id
            }
        });

        if (!product) {
            throw new AppError(
                "Product Not Found",
                404
            );
        }

        const {
            name,
            sku,
            description,
            category,
            sellingPrice,
            availableSizes,
            availableColors,
            quantity,
            isActive
        } = req.body;

        if (sku && sku !== product.sku) {

            const existingProduct =
                await this._productModel.findOne({
                    filter: {
                        sku,
                        _id: {
                            $ne: id
                        }
                    }
                });

            if (existingProduct) {
                throw new AppError(
                    "Product already exists",
                    409
                );
            }
        }

        const updateData: Partial<IProduct> = {};

        if (name !== undefined)
            updateData.name = name;

        if (sku !== undefined)
            updateData.sku = sku;

        if (description !== undefined)
            updateData.description = description;

        if (category !== undefined)
            updateData.category = category;

        if (sellingPrice !== undefined)
            updateData.sellingPrice = Number(sellingPrice);

        if (availableSizes !== undefined)
            updateData.availableSizes = availableSizes;

        if (availableColors !== undefined)
            updateData.availableColors = availableColors;

        if (quantity !== undefined)
            updateData.quantity = Number(quantity);

        if (isActive !== undefined)
            updateData.isActive = isActive;

        if (req.file) {

            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(
                    product.imagePublicId
                );
            }

            const uploadFromBuffer = (
                file: Express.Multer.File
            ) => {

                return new Promise<any>(
                    (resolve, reject) => {

                        const stream =
                            cloudinary.uploader.upload_stream(
                                {
                                    folder: "Volcano/Products"
                                },
                                (error, result) => {

                                    if (error)
                                        return reject(error);

                                    resolve(result);
                                }
                            );

                        streamifier
                            .createReadStream(file.buffer)
                            .pipe(stream);
                    }
                );
            };

            const result =
                await uploadFromBuffer(req.file);

            updateData.image = result.secure_url;
            updateData.imagePublicId =
                result.public_id;
        }

        const updatedProduct =
            await this._productModel.update(
                {
                    _id: id
                },
                updateData
            );

        successResponse({
            res,
            status: 200,
            message: "Product Updated Successfully",
            data: updatedProduct
        });
    };




}

export default new ProductService()
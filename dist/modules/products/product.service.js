"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const supplier_repository_1 = __importDefault(require("../../DB/repository/supplier.repository"));
const success_response_1 = require("../../common/utils/success.response");
const product_repository_1 = __importDefault(require("../../DB/repository/product.repository"));
const cloudinary_1 = __importDefault(require("../../common/utils/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
class ProductService {
    _attendanceModel = new attendance_repository_1.default();
    _employeeModel = new employee_repository_1.default();
    _supplierModel = new supplier_repository_1.default();
    _productModel = new product_repository_1.default();
    addProduct = async (req, res, next) => {
        const { name, sku, description, category, sellingPrice, availableSizes, availableColors, quantity } = req.body;
        const isProductExist = await this._productModel.findOne({
            filter: {
                sku
            }
        });
        if (isProductExist) {
            throw new global_error_handling_1.AppError("Product already exists", 409);
        }
        if (!req.file) {
            throw new global_error_handling_1.AppError("Product image is required", 400);
        }
        const uploadFromBuffer = (file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({
                    folder: "Volcano/Products"
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(stream);
            });
        };
        const result = await uploadFromBuffer(req.file);
        const { secure_url, public_id } = result;
        const product = await this._productModel.create({
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
    getProducts = async (req, res, next) => {
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
        });
        (0, success_response_1.successResponse)({ res, status: 200, message: "Product Fetched Successfully", data: products });
    };
    getProductById = async (req, res, next) => {
        const { id } = req.params;
        const product = await this._productModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!product) {
            throw new global_error_handling_1.AppError("Product Not Found", 404);
        }
        (0, success_response_1.successResponse)({ res, message: "product Fetched Successfully", status: 200, data: product });
    };
    deleteProduct = async (req, res, next) => {
        const { id } = req.params;
        const product = await this._productModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!product) {
            throw new global_error_handling_1.AppError("Product Not Found", 404);
        }
        await this._productModel.delete(product._id);
        (0, success_response_1.successResponse)({ res, message: "product deleted Successfully" });
    };
    updateProduct = async (req, res, next) => {
        const { id } = req.params;
        const product = await this._productModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!product) {
            throw new global_error_handling_1.AppError("Product Not Found", 404);
        }
        const { name, sku, description, category, sellingPrice, availableSizes, availableColors, quantity, isActive } = req.body;
        if (sku && sku !== product.sku) {
            const existingProduct = await this._productModel.findOne({
                filter: {
                    sku,
                    _id: {
                        $ne: id
                    }
                }
            });
            if (existingProduct) {
                throw new global_error_handling_1.AppError("Product already exists", 409);
            }
        }
        const updateData = {};
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
                await cloudinary_1.default.uploader.destroy(product.imagePublicId);
            }
            const uploadFromBuffer = (file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary_1.default.uploader.upload_stream({
                        folder: "Volcano/Products"
                    }, (error, result) => {
                        if (error)
                            return reject(error);
                        resolve(result);
                    });
                    streamifier_1.default
                        .createReadStream(file.buffer)
                        .pipe(stream);
                });
            };
            const result = await uploadFromBuffer(req.file);
            updateData.image = result.secure_url;
            updateData.imagePublicId =
                result.public_id;
        }
        const updatedProduct = await this._productModel.update({
            _id: id
        }, updateData);
        (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Product Updated Successfully",
            data: updatedProduct
        });
    };
}
exports.default = new ProductService();

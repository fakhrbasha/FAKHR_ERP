"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSize = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ProductSize;
(function (ProductSize) {
    ProductSize["S"] = "S";
    ProductSize["M"] = "M";
    ProductSize["L"] = "L";
    ProductSize["XL"] = "XL";
    ProductSize["XXL"] = "XXL";
})(ProductSize || (exports.ProductSize = ProductSize = {}));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    category: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    image: String,
    availableSizes: [{
            type: String,
            enum: Object.values(ProductSize)
        }],
    availableColors: [{
            type: String,
        }],
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    imagePublicId: String,
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
productSchema.index({ sku: 1, companyId: 1 }, { unique: true });
const productModel = mongoose_1.default.models.Product || mongoose_1.default.model("Product", productSchema);
exports.default = productModel;

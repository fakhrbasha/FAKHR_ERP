"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnSalesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const returnSalesSchema = new mongoose_1.default.Schema({
    saleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Sales",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            reason: String
        }
    ],
    refundAmount: Number,
    note: String,
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, {
    timestamps: true
});
exports.returnSalesModel = mongoose_1.default.models.ReturnSales || mongoose_1.default.model("ReturnSales", returnSalesSchema);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const salesSchema = new mongoose_1.default.Schema({
    customerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            quantity: Number,
            unitPrice: Number
        }
    ],
    totalAmount: Number,
    note: String,
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, {
    timestamps: true
});
exports.SalesModel = mongoose_1.default.models.Sales || mongoose_1.default.model("Sales", salesSchema);

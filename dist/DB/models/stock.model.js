"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockSchema = new mongoose_1.default.Schema({
    materialId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Material' },
    colorId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Color' },
    quantity: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    createdBy: { type: String, required: true },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const Stock = mongoose_1.default.models.Stock || mongoose_1.default.model('Stock', stockSchema);
exports.default = Stock;

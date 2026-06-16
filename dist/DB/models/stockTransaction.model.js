"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStock_Enum = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TransactionStock_Enum;
(function (TransactionStock_Enum) {
    TransactionStock_Enum["IN"] = "IN";
    TransactionStock_Enum["OUT"] = "OUT";
    TransactionStock_Enum["ADJUSTMENT"] = "ADJUSTMENT";
})(TransactionStock_Enum || (exports.TransactionStock_Enum = TransactionStock_Enum = {}));
const stockTransactionSchema = new mongoose_1.default.Schema({
    stockId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Stock' },
    quantity: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionStock_Enum), required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String },
    companyId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Company' }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const StockTransaction = mongoose_1.default.models.StockTransaction || mongoose_1.default.model('StockTransaction', stockTransactionSchema);
exports.default = StockTransaction;

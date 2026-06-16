"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const expensesSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        required: true
    },
    expenseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    note: String,
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
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
const ExpensesModel = mongoose_1.default.models.Expenses || mongoose_1.default.model("Expenses", expensesSchema);
exports.default = ExpensesModel;

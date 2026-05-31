"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true
    },
    departmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Departments",
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const employeeModel = mongoose_1.default.models.Employees || mongoose_1.default.model("Employees", employeeSchema);
exports.default = employeeModel;

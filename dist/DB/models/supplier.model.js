"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supplierSchema = new mongoose_1.default.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    companyId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Company", required: true }
});
supplierSchema.index({ phone: 1, companyId: 1 }, { unique: true });
supplierSchema.index({ email: 1, companyId: 1 }, { unique: true, sparse: true });
const Supplier = mongoose_1.default.models.Supplier || mongoose_1.default.model('Supplier', supplierSchema);
exports.default = Supplier;

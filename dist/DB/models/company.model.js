"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const companySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    adminId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const companyModel = mongoose_1.default.models.Company || mongoose_1.default.model("Company", companySchema);
exports.default = companyModel;

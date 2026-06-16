"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const material_enum_1 = require("../../common/enums/material.enum");
const materialSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    description: String,
    unit: {
        type: String,
        enum: material_enum_1.UnitEnum,
        default: material_enum_1.UnitEnum.kg
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
materialSchema.index({ code: 1, companyId: 1 }, { unique: true, sparse: true });
const materialModel = mongoose_1.default.models.Material || mongoose_1.default.model("Material", materialSchema);
exports.default = materialModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    hexCode: String,
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
});
const colorModel = mongoose_1.default.models.Color || mongoose_1.default.model("Color", colorSchema);
exports.default = colorModel;

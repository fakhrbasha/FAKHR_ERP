"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const material_repository_1 = __importDefault(require("../../DB/repository/material.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
class MaterialService {
    _materialModel = new material_repository_1.default();
    addMaterial = async (req, res, next) => {
        const { name, description, code, unit } = req.body;
        const isMaterial = await this._materialModel.findOne({
            filter: {
                $or: [
                    { code },
                    { name }
                ]
            }
        });
        if (isMaterial) {
            throw new global_error_handling_1.AppError("material already exist", 409);
        }
        const material = await this._materialModel.create({
            name: name.trim(), description, code: code?.trim().toUpperCase(), unit
        });
        return res.status(201).json({
            status: true,
            message: "Material Added Successfully",
            data: material
        });
    };
    getMaterials = async (req, res, next) => {
        const data = await this._materialModel.find({ filter: {} });
        if (!data) {
            throw new global_error_handling_1.AppError("Data Is Empty", 400);
        }
        return res.status(200).json({
            success: true,
            message: "Material retrieved Successfully",
            data
        });
    };
    getMaterialById = async (req, res, next) => {
        const { id } = req.params;
        const isMaterial = await this._materialModel.findOne({
            filter: { _id: id }
        });
        if (!isMaterial) {
            throw new global_error_handling_1.AppError("Material Not Found", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Material retrieved successfully",
            data: isMaterial
        });
    };
    updateMaterial = async (req, res, next) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new global_error_handling_1.AppError("Invalid material id", 400);
        }
        const { name, unit, description, code } = req.body;
        const isMaterial = await this._materialModel.findOne({
            filter: { _id: id }
        });
        if (!isMaterial) {
            throw new global_error_handling_1.AppError("Material Not Found", 404);
        }
        const materialWithSameCode = await this._materialModel.findOne({
            filter: {
                code
            }
        });
        if (materialWithSameCode &&
            materialWithSameCode._id.toString() !== id) {
            throw new global_error_handling_1.AppError("Material code already exists", 409);
        }
        const updateData = {};
        if (name !== undefined) {
            updateData.name = name;
        }
        if (unit !== undefined) {
            updateData.unit = unit;
        }
        if (description !== undefined) {
            updateData.description = description;
        }
        if (code !== undefined) {
            updateData.code = code;
        }
        const updatedMaterial = await this._materialModel.update({ _id: id }, updateData);
        return res.status(200).json({
            success: true,
            message: "Material updated successfully",
            data: updatedMaterial
        });
    };
    deleteMaterial = async (req, res, next) => {
        const { id } = req.params;
        if (Array.isArray(id)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new global_error_handling_1.AppError("Invalid material id", 400);
        }
        const isMaterial = await this._materialModel.findOne({
            filter: { _id: id }
        });
        if (!isMaterial) {
            throw new global_error_handling_1.AppError("Material not found", 404);
        }
        await this._materialModel.delete(isMaterial._id);
        return res.status(200).json({
            status: true,
            message: "delete Material successfully"
        });
    };
}
exports.default = new MaterialService();

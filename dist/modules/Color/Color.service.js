"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const color_repository_1 = __importDefault(require("../../DB/repository/color.repository"));
const success_response_1 = require("../../common/utils/success.response");
class ColorService {
    _colorModel = new color_repository_1.default();
    addColor = async (req, res, next) => {
        const { name, hexCode } = req.body;
        const isColor = await this._colorModel.findOne({
            filter: {
                $or: [
                    { name },
                    { hexCode }
                ]
            }
        });
        if (isColor) {
            throw new global_error_handling_1.AppError("Color is already exist", 409);
        }
        const color = await this._colorModel.create({
            name,
            hexCode
        });
        (0, success_response_1.successResponse)({ res, status: 201, message: "Color Added success", data: color });
    };
    getColors = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
            : {};
        const colors = await this._colorModel.paginate({
            page,
            limit,
            search: searchQuery,
        });
        if (!colors.data.length) {
            throw new global_error_handling_1.AppError("No Colors Found", 404);
        }
        (0, success_response_1.successResponse)({
            res,
            data: colors,
            message: "Colors Retrieved Successfully"
        });
    };
    editColor = async (req, res, next) => {
        const { id } = req.params;
        const { name, hexCode } = req.body;
        const isColor = await this._colorModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!isColor) {
            throw new global_error_handling_1.AppError("Color not found", 404);
        }
        if (isColor.name === undefined) {
            isColor.name = name;
        }
        if (isColor.hexCode === undefined) {
            isColor.hexCode = hexCode;
        }
        const updatedColor = await this._colorModel.update({ _id: id }, { name, hexCode });
        if (!updatedColor) {
            throw new global_error_handling_1.AppError("Failed to update color", 500);
        }
        (0, success_response_1.successResponse)({ res, message: "Color updated successfully", data: updatedColor });
    };
    deleteColor = async (req, res, next) => {
        const { id } = req.params;
        const isColor = await this._colorModel.findOne({
            filter: {
                _id: id
            }
        });
        if (!isColor) {
            throw new global_error_handling_1.AppError("Color not found", 404);
        }
        const deletedColor = await this._colorModel.delete(isColor._id);
        if (!deletedColor) {
            throw new global_error_handling_1.AppError("Failed to delete color", 500);
        }
        (0, success_response_1.successResponse)({ res, message: "Color deleted successfully" });
    };
}
exports.default = new ColorService();

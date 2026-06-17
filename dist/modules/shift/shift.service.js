"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shift_repository_1 = __importDefault(require("../../DB/repository/shift.repository"));
const global_error_handling_1 = require("../../common/utils/global-error-handling");
class ShiftService {
    _shiftModel = new shift_repository_1.default();
    createShift = async (req, res, next) => {
        const { name, startTime, endTime, workingHours } = req.body;
        const shift = await this._shiftModel.create({
            name,
            startTime,
            endTime,
            workingHours
        });
        return res.status(201).json({
            success: true,
            message: "Shift created successfully",
            data: shift
        });
    };
    getShifts = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const data = await this._shiftModel.paginate({
            page,
            limit,
            sort: { createdAt: -1 }
        });
        return res.status(200).json({
            success: true,
            message: "Shifts fetched successfully",
            data
        });
    };
    getShiftById = async (req, res, next) => {
        const { id } = req.params;
        const shift = await this._shiftModel.findById(id);
        if (!shift) {
            throw new global_error_handling_1.AppError("Shift not found", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Shift fetched successfully",
            data: shift
        });
    };
    updateShift = async (req, res, next) => {
        const { id } = req.params;
        const shift = await this._shiftModel.update({ _id: id }, req.body);
        if (!shift) {
            throw new global_error_handling_1.AppError("Shift not found", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Shift updated successfully",
            data: shift
        });
    };
    deleteShift = async (req, res, next) => {
        const { id } = req.params;
        const shift = await this._shiftModel.delete(id);
        if (!shift) {
            throw new global_error_handling_1.AppError("Shift not found", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Shift deleted successfully"
        });
    };
}
exports.default = new ShiftService();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
class SupplierService {
    _attendanceModel = new attendance_repository_1.default();
    makeOrder = async (req, res, next) => {
    };
}
exports.default = new SupplierService();

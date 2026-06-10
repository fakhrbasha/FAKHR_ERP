"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const attendance_enum_1 = require("../../common/enums/attendance.enum");
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
class AttendanceService {
    _attendanceModel = new attendance_repository_1.default();
    _employeeModel = new employee_repository_1.default();
    checkIn = async (req, res, next) => {
        const { employeeId } = req.params;
        if (Array.isArray(employeeId)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        const isEmployeeExist = await this._employeeModel.findOne({ filter: { _id: employeeId } });
        if (!isEmployeeExist) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const isAlreadyCheckIn = await this._attendanceModel.findOne({
            filter: {
                employeeId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            },
        });
        if (isAlreadyCheckIn) {
            throw new global_error_handling_1.AppError("Employee already checked in today", 409);
        }
        const attendance = await this._attendanceModel.create({
            employeeId: new mongoose_1.default.Types.ObjectId(employeeId),
            date: new Date(),
            checkIn: new Date(),
            status: attendance_enum_1.attendanceStatus.present
        });
        return res.status(201).json({
            success: true,
            message: "Check in successful",
            data: attendance
        });
    };
    checkOut = async (req, res, next) => {
        const { employeeId } = req.params;
        if (Array.isArray(employeeId)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        const employee = await this._employeeModel.findOne({ filter: { _id: employeeId } });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const attendance = await this._attendanceModel.findOne({
            filter: {
                employeeId, date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }
        });
        if (!attendance) {
            throw new global_error_handling_1.AppError("Employee did not check in today", 404);
        }
        if (attendance.checkOut) {
            throw new global_error_handling_1.AppError("Employee Already Checked Out", 409);
        }
        const now = new Date();
        const workedHours = (now.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);
        const overTimeHours = workedHours > 12 ? Number((workedHours - 12).toFixed(2)) : 0;
        const updatedAttendance = await this._attendanceModel.update({ _id: attendance._id }, { checkOut: now, overTimeHours: overTimeHours });
        return res.status(200).json({
            success: true,
            message: "Check out successful",
            data: updatedAttendance
        });
    };
    getAttendance = async (req, res, next) => {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const searchQuery = req.query.search
            ? {
                $or: [
                    {
                        checkIn: {
                            $regex: req.query.search,
                            $options: "i"
                        }
                    },
                    {
                        checkOut: {
                            $regex: req.query.search,
                            $options: "i"
                        }
                    },
                ]
            }
            : {};
        const data = await this._attendanceModel.paginate({
            page,
            limit,
            search: searchQuery
        });
        return res.status(200).json({
            success: true,
            message: "Attendance Retrieved Success",
            data
        });
    };
}
exports.default = new AttendanceService();

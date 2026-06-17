"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const shift_repository_1 = __importDefault(require("../../DB/repository/shift.repository"));
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const attendance_enum_1 = require("../../common/enums/attendance.enum");
class AttendanceService {
    _attendanceModel = new attendance_repository_1.default();
    _employeeModel = new employee_repository_1.default();
    _shiftModel = new shift_repository_1.default();
    getAttendance = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.toString();
        const searchQuery = search
            ? {
                $or: [
                    {
                        status: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            }
            : {};
        const attendance = await this._attendanceModel.paginate({
            page,
            limit,
            search: searchQuery,
            sort: {
                date: -1
            },
            populate: [
                {
                    path: "employeeId",
                    select: "fullName phone role shiftId",
                    populate: {
                        path: "shiftId",
                        select: "name startTime endTime workingHours"
                    }
                }
            ]
        });
        return res.status(200).json({
            success: true,
            message: "Attendance retrieved successfully",
            data: attendance
        });
    };
    createAttendance = async (req, res, next) => {
        const { checkIn, checkOut } = req.body;
        const { employeeId } = req.params;
        if (Array.isArray(employeeId)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
            throw new global_error_handling_1.AppError("Invalid employee id", 400);
        }
        const employee = await this._employeeModel.findOne({
            filter: { _id: employeeId },
            options: {
                populate: "shiftId"
            }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        const shift = employee.shiftId;
        if (!shift) {
            throw new global_error_handling_1.AppError("Shift not assigned", 400);
        }
        if (!checkIn || !checkOut) {
            throw new global_error_handling_1.AppError("checkIn and checkOut are required", 400);
        }
        const parseTimeToDate = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            if (isNaN(hours) || isNaN(minutes)) {
                throw new global_error_handling_1.AppError("Invalid time format (use HH:mm)", 400);
            }
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        };
        const start = parseTimeToDate(checkIn);
        const end = parseTimeToDate(checkOut);
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new global_error_handling_1.AppError("Invalid date format", 400);
        }
        if (end < start) {
            throw new global_error_handling_1.AppError("CheckOut cannot be before CheckIn", 400);
        }
        const [shiftStartH, shiftStartM] = shift.startTime.split(":").map(Number);
        const [shiftEndH, shiftEndM] = shift.endTime.split(":").map(Number);
        const shiftStart = new Date(start);
        shiftStart.setHours(shiftStartH, shiftStartM, 0, 0);
        const shiftEnd = new Date(start);
        shiftEnd.setHours(shiftEndH, shiftEndM, 0, 0);
        const diffMs = end.getTime() - start.getTime();
        if (diffMs < 0) {
            throw new global_error_handling_1.AppError("checkOut cannot be before checkIn", 400);
        }
        const workedHours = diffMs / (1000 * 60 * 60);
        const expectedHours = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60);
        const lateMinutes = Math.max(0, (start.getTime() - shiftStart.getTime()) / (1000 * 60));
        const overtimeHours = workedHours > expectedHours
            ? workedHours - expectedHours
            : 0;
        const missingHours = workedHours < expectedHours
            ? expectedHours - workedHours
            : 0;
        let status;
        if (workedHours === 0) {
            status = attendance_enum_1.attendanceStatus.absent;
        }
        else if (start > shiftStart) {
            status = attendance_enum_1.attendanceStatus.late;
        }
        else {
            status = attendance_enum_1.attendanceStatus.present;
        }
        const attendance = await this._attendanceModel.create({
            employeeId,
            checkIn: start,
            checkOut: end,
            date: new Date(),
            workedHours: Number(workedHours.toFixed(2)),
            overtimeHours: Number(overtimeHours.toFixed(2)),
            missingHours: Number(missingHours.toFixed(2)),
            lateMinutes: Number(lateMinutes.toFixed(0)),
            status,
            companyId: employee.companyId
        });
        return res.status(201).json({
            success: true,
            message: "Attendance created successfully",
            data: attendance
        });
    };
}
exports.default = new AttendanceService();

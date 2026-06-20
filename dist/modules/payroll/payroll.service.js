"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const employee_repository_1 = __importDefault(require("../../DB/repository/employee.repository"));
const success_response_1 = require("../../common/utils/success.response");
const payroll_repository_1 = __importDefault(require("../../DB/repository/payroll.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const attendance_repository_1 = __importDefault(require("../../DB/repository/attendance.repository"));
class PaymentEmployee {
    _employeeModel = new employee_repository_1.default();
    _payrollModel = new payroll_repository_1.default();
    _attendanceModel = new attendance_repository_1.default();
    createEmployeePayment = async (req, res) => {
        const { employeeId, amount, week, note } = req.body;
        const employee = await this._employeeModel.findOne({
            filter: { _id: employeeId }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        if (amount <= 0) {
            throw new global_error_handling_1.AppError("Amount must be greater than zero", 400);
        }
        const payroll = await this._payrollModel.create({
            employeeId,
            amount,
            paymentDate: new Date(),
            week,
            note,
            createdBy: req.user._id
        });
        (0, success_response_1.successResponse)({
            res,
            status: 201,
            message: "Employee payment created successfully",
            data: payroll
        });
    };
    getEmployeePaymentSummary = async (req, res, next) => {
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
                populate: {
                    path: "shiftId"
                }
            }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not found", 404);
        }
        const shift = employee.shiftId;
        if (!shift) {
            throw new global_error_handling_1.AppError("Employee has no assigned shift", 400);
        }
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        const attendances = await this._attendanceModel.find({
            filter: {
                employeeId,
                date: {
                    $gte: startOfWeek,
                    $lte: endOfWeek
                }
            }
        });
        const payments = await this._payrollModel.find({
            filter: {
                employeeId,
                paymentDate: {
                    $gte: startOfWeek,
                    $lte: endOfWeek
                }
            }
        });
        const weeklySalary = employee.salary;
        const workingDays = shift.workingDays || 6;
        const weeklyHours = shift.workingHours *
            workingDays;
        const hourRate = weeklySalary /
            weeklyHours;
        const totalWorkedHours = attendances.reduce((sum, item) => sum +
            (item.workedHours || 0), 0);
        const totalMissingHours = attendances.reduce((sum, item) => sum +
            (item.missingHours || 0), 0);
        const totalLateMinutes = attendances.reduce((sum, item) => sum +
            (item.lateMinutes || 0), 0);
        const totalOvertimeHours = attendances.reduce((sum, item) => sum +
            (item.overtimeHours || 0), 0);
        const absentDeduction = totalMissingHours *
            hourRate;
        const lateDeduction = (totalLateMinutes / 60) *
            hourRate;
        const overtimeAmount = totalOvertimeHours *
            hourRate;
        const netSalary = weeklySalary -
            absentDeduction -
            lateDeduction +
            overtimeAmount;
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingBalance = netSalary - totalPaid;
        return (0, success_response_1.successResponse)({
            res,
            status: 200,
            message: "Employee payment summary retrieved successfully",
            data: {
                employeeId: employee._id,
                employeeName: employee.fullName,
                weekStart: startOfWeek,
                weekEnd: endOfWeek,
                weeklySalary,
                weeklyHours,
                hourRate: Number(hourRate.toFixed(2)),
                totalWorkedHours: Number(totalWorkedHours.toFixed(2)),
                totalMissingHours: Number(totalMissingHours.toFixed(2)),
                totalLateMinutes,
                totalOvertimeHours: Number(totalOvertimeHours.toFixed(2)),
                absentDeduction: Number(absentDeduction.toFixed(2)),
                lateDeduction: Number(lateDeduction.toFixed(2)),
                overtimeAmount: Number(overtimeAmount.toFixed(2)),
                netSalary: Number(netSalary.toFixed(2)),
                totalPaid,
                remainingBalance: Number(remainingBalance.toFixed(2))
            }
        });
    };
    getEmployeeById = async (req, res) => {
        const { employeeId } = req.params;
        const employee = await this._employeeModel.findOne({
            filter: { _id: employeeId }
        });
        if (!employee) {
            throw new global_error_handling_1.AppError("Employee not exist", 404);
        }
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const data = await this._payrollModel.paginate({
            page,
            limit,
            search: {
                employeeId
            }
        });
        (0, success_response_1.successResponse)({ res, message: `Payment for ${employee.fullName} fetched success`, data });
    };
}
exports.default = new PaymentEmployee();

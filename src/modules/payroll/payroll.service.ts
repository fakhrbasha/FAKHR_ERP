import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import EmployeeRepository from "../../DB/repository/employee.repository"
import { successResponse } from "../../common/utils/success.response"
import EmployeePaymentRepository from "../../DB/repository/payroll.repository"
import mongoose from "mongoose"
import AttendanceRepository from "../../DB/repository/attendance.repository"



class PaymentEmployee {




    private readonly _employeeModel = new EmployeeRepository()
    private readonly _payrollModel = new EmployeePaymentRepository()
    private readonly _attendanceModel = new AttendanceRepository();

    createEmployeePayment = async (
        req: Request,
        res: Response
    ) => {

        const {
            employeeId,
            amount,
            week,
            note
        } = req.body;
        const employee =
            await this._employeeModel.findOne({
                filter: { _id: employeeId }
            });
        if (!employee) {
            throw new AppError(
                "Employee not found",
                404
            );
        }
        if (amount <= 0) {
            throw new AppError(
                "Amount must be greater than zero",
                400
            );
        }
        const payroll =
            await this._payrollModel.create({
                employeeId,
                amount,
                paymentDate: new Date(),
                week,
                note,
                createdBy: req.user._id
            });
        successResponse({
            res,
            status: 201,
            message: "Employee payment created successfully",
            data: payroll
        });
    };
    // getEmployeePaymentSummary = async (
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) => {
    //     const { employeeId } = req.params;
    //     if (Array.isArray(employeeId)) {

    //         throw new AppError("Invalid employee id", 400);
    //     }
    //     if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    //         throw new AppError("Invalid employee id", 400);
    //     }

    //     const employee = await this._employeeModel.findOne({
    //         filter: { _id: employeeId }
    //     });

    //     if (!employee) {
    //         throw new AppError("Employee not found", 404);
    //     }

    //     const payments = await this._payrollModel.find({
    //         filter: { employeeId }
    //     });

    //     const weeksWorked = payments.length;

    //     const totalPaid = payments.reduce(
    //         (sum, payment) => sum + payment.amount,
    //         0
    //     );

    //     const expectedSalary = weeksWorked * employee.salary;

    //     const balance = expectedSalary - totalPaid;

    //     return successResponse({
    //         res,
    //         status: 200,
    //         message: "Employee payment summary retrieved successfully",
    //         data: {
    //             employeeId: employee._id,
    //             employeeName: employee.fullName,

    //             salaryPerWeek: employee.salary,

    //             weeksWorked,
    //             expectedSalary,

    //             totalPaid,

    //             balance
    //         }
    //     });
    // };
    getEmployeePaymentSummary = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { employeeId } = req.params;
        if (Array.isArray(employeeId)) {

            throw new AppError("Invalid employee id", 400);
        }
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            throw new AppError("Invalid employee id", 400);
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
            throw new AppError("Employee not found", 404);
        }

        const shift = employee.shiftId as any;

        if (!shift) {
            throw new AppError(
                "Employee does not have a shift assigned",
                400
            );
        }

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(
            startOfWeek.getDate() - startOfWeek.getDay()
        );

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const attendances =
            await this._attendanceModel.find({
                filter: {
                    employeeId,
                    date: {
                        $gte: startOfWeek,
                        $lte: endOfWeek
                    }
                }
            });

        const payments =
            await this._payrollModel.find({
                filter: {
                    employeeId,
                    paymentDate: {
                        $gte: startOfWeek,
                        $lte: endOfWeek
                    }
                }
            });

        const weeklySalary = Number(employee.salary);

        const workingDays =
            Number(shift.workingDays) || 7;

        const shiftHours =
            Number(shift.workingHours);

        const weeklyHours =
            shiftHours * workingDays;

        const hourRate =
            weeklyHours > 0
                ? weeklySalary / weeklyHours
                : 0;

        const totalWorkedHours =
            attendances.reduce(
                (sum, item: any) =>
                    sum + (item.workedHours || 0),
                0
            );

        const totalMissingHours =
            attendances.reduce(
                (sum, item: any) =>
                    sum + (item.missingHours || 0),
                0
            );

        const totalLateMinutes =
            attendances.reduce(
                (sum, item: any) =>
                    sum + (item.lateMinutes || 0),
                0
            );

        const totalOvertimeHours =
            attendances.reduce(
                (sum, item: any) =>
                    sum + (item.overtimeHours || 0),
                0
            );

        const absentDeduction =
            totalMissingHours * hourRate;

        const lateDeduction =
            (totalLateMinutes / 60) * hourRate;

        const overtimeAmount =
            totalOvertimeHours * hourRate;

        const netSalary =
            weeklySalary
            - absentDeduction
            - lateDeduction
            + overtimeAmount;

        const totalPaid =
            payments.reduce(
                (sum, item: any) =>
                    sum + item.amount,
                0
            );

        const remainingBalance =
            netSalary - totalPaid;

        return successResponse({
            res,
            status: 200,
            message:
                "Employee payment summary retrieved successfully",
            data: {
                employeeId: employee._id,
                employeeName: employee.fullName,

                weekStart: startOfWeek,
                weekEnd: endOfWeek,

                weeklySalary,

                workingDays,
                shiftHours,
                weeklyHours,

                hourRate: Number(
                    hourRate.toFixed(2)
                ),

                totalWorkedHours: Number(
                    totalWorkedHours.toFixed(2)
                ),

                totalMissingHours: Number(
                    totalMissingHours.toFixed(2)
                ),

                totalLateMinutes,

                totalOvertimeHours: Number(
                    totalOvertimeHours.toFixed(2)
                ),

                absentDeduction: Number(
                    absentDeduction.toFixed(2)
                ),

                lateDeduction: Number(
                    lateDeduction.toFixed(2)
                ),

                overtimeAmount: Number(
                    overtimeAmount.toFixed(2)
                ),

                netSalary: Number(
                    netSalary.toFixed(2)
                ),

                totalPaid: Number(
                    totalPaid.toFixed(2)
                ),

                remainingBalance: Number(
                    remainingBalance.toFixed(2)
                ),

                attendanceCount:
                    attendances.length,

                paymentsCount:
                    payments.length
            }
        });
    };
    getEmployeeById = async (req: Request,
        res: Response) => {
        const { employeeId } = req.params

        const employee = await this._employeeModel.findOne({
            filter: { _id: employeeId }
        })
        if (!employee) {
            throw new AppError("Employee not exist", 404)
        }

        const page = Number(req.query.page)
        const limit = Number(req.query.limit)

        const data = await this._payrollModel.paginate({
            page,
            limit,
            search: {
                employeeId
            }
        })
        successResponse({ res, message: `Payment for ${employee.fullName} fetched success`, data })
    }







}

export default new PaymentEmployee()
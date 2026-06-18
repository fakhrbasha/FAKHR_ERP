import { NextFunction, Request, Response } from "express"
import { AppError } from "../../common/utils/global-error-handling"
import EmployeeRepository from "../../DB/repository/employee.repository"
import { successResponse } from "../../common/utils/success.response"
import EmployeePaymentRepository from "../../DB/repository/payroll.repository"
import mongoose from "mongoose"



class PaymentEmployee {




    private readonly _employeeModel = new EmployeeRepository()
    private readonly _payrollModel = new EmployeePaymentRepository()

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
            filter: { _id: employeeId }
        });

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        const payments = await this._payrollModel.find({
            filter: { employeeId }
        });

        const weeksWorked = payments.length;

        const totalPaid = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

        const expectedSalary = weeksWorked * employee.salary;

        const balance = expectedSalary - totalPaid;

        return successResponse({
            res,
            status: 200,
            message: "Employee payment summary retrieved successfully",
            data: {
                employeeId: employee._id,
                employeeName: employee.fullName,

                salaryPerWeek: employee.salary,

                weeksWorked,
                expectedSalary,

                totalPaid,

                balance
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
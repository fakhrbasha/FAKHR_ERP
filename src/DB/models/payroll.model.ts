import mongoose, { HydratedDocument, Types } from "mongoose";

export interface IEmployeePayment {
    employeeId: Types.ObjectId;

    amount: number;

    paymentDate?: Date;

    week?: string;

    note?: string;

    createdBy: Types.ObjectId;
    companyId: Types.ObjectId

}

const employeePaymentSchema =
    new mongoose.Schema<IEmployeePayment>({
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentDate: {
            type: Date,
            default: Date.now
        },

        week: String,

        note: String,

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        }
    }, {
        timestamps: true
    });

const EmployeePaymentModel =
    mongoose.models.EmployeePayment ||
    mongoose.model<IEmployeePayment>(
        "EmployeePayment",
        employeePaymentSchema
    );

export default EmployeePaymentModel;

export type EmployeePaymentDocument =
    HydratedDocument<IEmployeePayment>;
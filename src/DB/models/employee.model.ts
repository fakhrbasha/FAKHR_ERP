import mongoose, { HydratedDocument, Types } from "mongoose";


export interface IEmployee {
    fullName: string,
    salary: number,
    phone?: string;
    departmentId?: Types.ObjectId,
    role: string;
}

const employeeSchema = new mongoose.Schema<IEmployee>({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Departments",
        required: true
    },
    role: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const employeeModel = mongoose.models.Employees || mongoose.model<IEmployee>("Employees", employeeSchema)


export default employeeModel;
export type UserDocument = HydratedDocument<IEmployee>;
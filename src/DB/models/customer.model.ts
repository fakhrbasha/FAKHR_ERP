import mongoose, { HydratedDocument, Types, Schema } from "mongoose"


export interface ICustomer {
    name: string,
    phone: string,
    address: string,
    note?: string,
    companyId: Types.ObjectId
}

const customerSchema = new mongoose.Schema<ICustomer>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})

customerSchema.index({ phone: 1, companyId: 1 }, { unique: true });

const customerModel = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema)

export default customerModel;
export type AttendanceDocument = HydratedDocument<ICustomer>;
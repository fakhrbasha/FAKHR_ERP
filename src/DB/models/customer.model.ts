import mongoose, { HydratedDocument, Types, Schema } from "mongoose"


export interface ICustomer {
    name: string,
    phone: string,
    address: string,
    note?: string

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
        trim: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
    },


}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})

const customerModel = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema)

export default customerModel;
export type AttendanceDocument = HydratedDocument<ICustomer>;
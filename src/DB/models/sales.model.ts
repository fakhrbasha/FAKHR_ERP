import mongoose, { Types } from "mongoose";

export interface ISale {
    customerId: Types.ObjectId;

    items: {
        productId: Types.ObjectId;
        quantity: number;
        unitPrice: number;
    }[];

    totalAmount: number;

    note?: string;

    createdBy: Types.ObjectId;
    createdAt: Date;
    companyId: Types.ObjectId;
}

const salesSchema = new mongoose.Schema<ISale>({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            quantity: Number,
            unitPrice: Number
        }
    ],
    totalAmount: Number,
    note: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }


}, {
    timestamps: true
})


export const SalesModel = mongoose.models.Sales || mongoose.model<ISale>("Sales", salesSchema)
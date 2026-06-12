import mongoose, { Types } from "mongoose";


export interface ISalesReturn {
    saleId: Types.ObjectId;

    items: {
        productId: Types.ObjectId;
        quantity: number;
        reason?: string;
    }[];
    refundAmount: number,

    note?: string;

    createdBy: Types.ObjectId;
    createdAt: Date
}


const returnSalesSchema = new mongoose.Schema<ISalesReturn>({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sales",
        required: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            reason: String
        }
    ],
    refundAmount: Number,
    note: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }


}, {
    timestamps: true
})


export const returnSalesModel = mongoose.models.ReturnSales || mongoose.model<ISalesReturn>("ReturnSales", returnSalesSchema)
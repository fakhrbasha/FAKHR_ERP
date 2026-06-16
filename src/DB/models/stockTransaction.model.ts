import mongoose, { Types } from "mongoose";

export enum TransactionStock_Enum {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT"
}


export interface IStockTransaction {
    stockId: Types.ObjectId;
    quantity: number;
    type: TransactionStock_Enum;
    createdBy: Types.ObjectId;
    reason?: string;
    companyId: Types.ObjectId;
}


const stockTransactionSchema = new mongoose.Schema<IStockTransaction>({
    stockId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Stock' },
    quantity: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionStock_Enum), required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const StockTransaction = mongoose.models.StockTransaction || mongoose.model<IStockTransaction>('StockTransaction', stockTransactionSchema);

export default StockTransaction;
export type StockTransactionDocument = mongoose.HydratedDocument<IStockTransaction>;
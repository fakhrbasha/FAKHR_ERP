
// link material mm color and quantity and min quantity to stock

import mongoose, { HydratedDocument, Types } from "mongoose";

export interface IYarnStock {
    materialId: Types.ObjectId;
    colorId: Types.ObjectId;
    quantity: number;
    minQuantity: number;
    createdBy: Types.ObjectId;
    // createdBy: string;
}


const stockSchema = new mongoose.Schema<IYarnStock>({
    materialId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Material' },
    colorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Color' },
    quantity: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    // createdBy: { type: String, required: true },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})


const Stock = mongoose.models.Stock || mongoose.model<IYarnStock>('Stock', stockSchema);

export default Stock;
export type StockDocument = HydratedDocument<IYarnStock>;


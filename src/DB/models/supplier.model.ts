import mongoose, { Types } from "mongoose";


export interface ISupplier {
    companyName: string;
    contactPerson: string;
    email?: string;
    phone: string;
    address: string;
    note?: string;
    companyId: Types.ObjectId;
}


const supplierSchema = new mongoose.Schema<ISupplier>({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }
})

supplierSchema.index({ phone: 1, companyId: 1 }, { unique: true });
supplierSchema.index({ email: 1, companyId: 1 }, { unique: true, sparse: true });

const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', supplierSchema);

export default Supplier;
export type SupplierDocument = mongoose.HydratedDocument<ISupplier>;
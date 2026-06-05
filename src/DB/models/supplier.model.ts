import mongoose from "mongoose";


export interface ISupplier {
    companyName: string;
    contactPerson: string;
    email?: string;
    phone: string;
    address: string;
    note?: string;
}


const supplierSchema = new mongoose.Schema<ISupplier>({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    note: { type: String }
})


const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', supplierSchema);

export default Supplier;
export type SupplierDocument = mongoose.HydratedDocument<ISupplier>;
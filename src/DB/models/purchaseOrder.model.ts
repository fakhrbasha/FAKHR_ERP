import mongoose, { Schema, Types } from "mongoose";

export enum PurchaseOrderStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED"
}
export interface IPurchaseOrderItem {
    materialId: Types.ObjectId;
    colorId: Types.ObjectId;
    quantity: number;
    unitPrice: number;
}

export interface IPurchaseOrder {
    supplierId: Types.ObjectId;

    items: IPurchaseOrderItem[];

    totalAmount: number;

    status: PurchaseOrderStatus;

    notes?: string;

    createdBy: Types.ObjectId;
    companyId: Types.ObjectId;
}

const purchaseOrderSchema = new mongoose.Schema<IPurchaseOrder>({
    supplierId: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    }, items: [
        {
            materialId: {
                type: Schema.Types.ObjectId,
                ref: "Material",
                required: true
            },

            colorId: {
                type: Schema.Types.ObjectId,
                ref: "Color",
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            unitPrice: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: Object.values(PurchaseOrderStatus),
        default: PurchaseOrderStatus.PENDING
    },

    notes: String,

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, {
    timestamps: true
})


const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
export type SupplierDocument = mongoose.HydratedDocument<IPurchaseOrder>;
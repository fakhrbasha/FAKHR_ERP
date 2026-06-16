import mongoose, { HydratedDocument, Types, Schema } from "mongoose"
export enum ProductSize {
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL"
}

// export enum ProductColor {
//     BLACK = "BLACK",
//     WHITE = "WHITE",
//     BLUE = "BLUE",
//     RED = "RED",
//     GREEN = "GREEN"
// }
export interface IProduct {

    name: string;
    sku: string;
    description?: string;
    category: string;
    sellingPrice: number;
    image?: string;
    isActive: boolean;
    availableSizes: ProductSize[];

    availableColors: string[];
    quantity: number,
    imagePublicId: string;
    companyId: Types.ObjectId;

}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },

    sku: {
        type: String,
        required: true,
        trim: true
    },

    description: String,

    category: {
        type: String,
        required: true
    },

    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },

    image: String,

    availableSizes: [{
        type: String,
        enum: Object.values(ProductSize)
    }],

    availableColors: [{
        type: String,
        // enum: Object.values(ProductColor)
    }],


    quantity: {
        type: Number,
        default: 0,
        min: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
    , imagePublicId: String,
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

productSchema.index({ sku: 1, companyId: 1 }, { unique: true });

const productModel = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)

export default productModel;
export type AttendanceDocument = HydratedDocument<IProduct>;
import mongoose, { HydratedDocument, Types } from "mongoose";

export interface ICompany {
    _id: Types.ObjectId;
    name: string;
    adminId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const companySchema = new mongoose.Schema<ICompany>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const companyModel = mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);

export default companyModel;
export type CompanyDocument = HydratedDocument<ICompany>;

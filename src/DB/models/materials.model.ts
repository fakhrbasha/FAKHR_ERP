import mongoose, { HydratedDocument, Types } from "mongoose"
import { string } from "zod"
import { UnitEnum } from "../../common/enums/material.enum"


export interface IMaterial {
    name: string,
    code?: string,
    description?: string,
    unit: UnitEnum,
    companyId: Types.ObjectId
}


const materialSchema = new mongoose.Schema<IMaterial>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    description: String,
    unit: {
        type: String,
        enum: UnitEnum,
        default: UnitEnum.kg
    },
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

materialSchema.index({ code: 1, companyId: 1 }, { unique: true, sparse: true });


const materialModel = mongoose.models.Material || mongoose.model<IMaterial>("Material", materialSchema)

export default materialModel;
export type MaterialDocument = HydratedDocument<IMaterial>;
import mongoose, { HydratedDocument } from "mongoose"
import { string } from "zod"
import { UnitEnum } from "../../common/enums/material.enum"


export interface IMaterial {
    name: string,
    code?: string,
    description?: string,
    unit: UnitEnum
}


const materialSchema = new mongoose.Schema<IMaterial>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true
    },
    description: String,
    unit: {
        type: String,
        enum: UnitEnum,
        default: UnitEnum.kg
    }
})


const materialModel = mongoose.models.Material || mongoose.model<IMaterial>("Material", materialSchema)

export default materialModel;
export type UserDocument = HydratedDocument<IMaterial>;
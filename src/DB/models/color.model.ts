import mongoose, { HydratedDocument, Types } from "mongoose"


export interface IColor {
    name: string,
    hexCode?: string,
    companyId: Types.ObjectId
}



const colorSchema = new mongoose.Schema<IColor>({
    name: {
        type: String,
        required: true
    },
    hexCode: String,
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
})


const colorModel = mongoose.models.Color || mongoose.model<IColor>("Color", colorSchema)

export default colorModel;
export type UserDocument = HydratedDocument<IColor>;
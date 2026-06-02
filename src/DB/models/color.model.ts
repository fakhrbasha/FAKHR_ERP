import mongoose, { HydratedDocument } from "mongoose"


export interface IColor {
    name: string,
    hexCode?: string
}



const colorSchema = new mongoose.Schema<IColor>({
    name: {
        type: String,
        required: true
    },
    hexCode: String
})


const colorModel = mongoose.models.Color || mongoose.model<IColor>("Color", colorSchema)

export default colorModel;
export type UserDocument = HydratedDocument<IColor>;
import mongoose, { HydratedDocument } from "mongoose"


export interface IDepartment {
    name: string
}

const deptSchema = new mongoose.Schema<IDepartment>({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const departmentModel = mongoose.models.Department || mongoose.model<IDepartment>("Department", deptSchema)


export default departmentModel;
export type UserDocument = HydratedDocument<IDepartment>;
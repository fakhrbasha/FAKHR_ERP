import mongoose, { HydratedDocument, Types } from "mongoose"


export interface IDepartment {
    name: string,
    companyId: Types.ObjectId
}

const deptSchema = new mongoose.Schema<IDepartment>({
    name: {
        type: String,
        required: true
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

deptSchema.index({ name: 1, companyId: 1 }, { unique: true });

const departmentModel = mongoose.models.Department || mongoose.model<IDepartment>("Department", deptSchema)


export default departmentModel;
export type DepartmentDocument = HydratedDocument<IDepartment>;
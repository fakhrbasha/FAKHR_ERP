import mongoose, { Types } from "mongoose";

export interface IShift {
    name: string;
    startTime: string;
    endTime: string;
    workingHours: number;
    workingDays: number;
    companyId: Types.ObjectId;
}

const shiftSchema = new mongoose.Schema<IShift>({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    workingHours: {
        type: Number,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    workingDays: {
        type: Number,
        default: 7
    }
}, {
    timestamps: true
});

const shiftModel = mongoose.models.Shift || mongoose.model<IShift>("Shift", shiftSchema)
export default shiftModel;
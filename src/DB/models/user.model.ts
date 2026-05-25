import mongoose, { HydratedDocument, Types } from "mongoose";
import { RoleEnum } from "../../common/enums/user.enum";

export interface IUser {
    _id: Types.ObjectId,
    firstName: string,
    lastName: string,
    userName: string, // virtual
    email: string,
    phone?: string,
    role?: RoleEnum,
    password: string,
    isConfirmed: boolean,

    pictures?: string[],
    createdAt?: Date,
    updatedAt?: Date
}

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: { type: String, trim: true },
    password: {
        type: String, required: true, trim: true, min: 6, max: 100
    },
    isConfirmed: { type: Boolean },
    role: { type: String, enum: RoleEnum, default: RoleEnum.user },

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual("userName").get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`
}).set(function (this: IUser, value: string) {
    const [firstName, lastName] = value.split(" ")
    this.firstName = firstName
    this.lastName = lastName
})

const userModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default userModel;
export type UserDocument = HydratedDocument<IUser>;
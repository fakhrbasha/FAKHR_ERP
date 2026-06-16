import mongoose, { Types } from "mongoose";

export enum NotificationType {
    LOW_STOCK = "LOW_STOCK",
    PURCHASE_ORDER = "PURCHASE_ORDER",
    ATTENDANCE = "ATTENDANCE",
    SYSTEM = "SYSTEM"
}

export interface INotification {
    title: string,
    message: string,
    type: NotificationType,
    isRead: boolean,
    userId: Types.ObjectId,
    companyId: Types.ObjectId
}

const notificationSchema = new mongoose.Schema<INotification>({
    title: String,
    message: String,
    type: String,
    isRead: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, {
    timestamps: true
})


export const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema)
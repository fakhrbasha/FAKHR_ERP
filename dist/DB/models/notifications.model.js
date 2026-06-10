"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = exports.NotificationType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var NotificationType;
(function (NotificationType) {
    NotificationType["LOW_STOCK"] = "LOW_STOCK";
    NotificationType["PURCHASE_ORDER"] = "PURCHASE_ORDER";
    NotificationType["ATTENDANCE"] = "ATTENDANCE";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
const notificationSchema = new mongoose_1.default.Schema({
    title: String,
    message: String,
    type: String,
    isRead: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});
exports.NotificationModel = mongoose_1.default.models.Notification || mongoose_1.default.model("Notification", notificationSchema);

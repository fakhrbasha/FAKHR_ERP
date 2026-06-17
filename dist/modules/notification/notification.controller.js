"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const notification_service_1 = __importDefault(require("./notification.service"));
const notificationRouter = (0, express_1.Router)();
notificationRouter.get('/', authentication_1.authentication, notification_service_1.default.getNotifications);
notificationRouter.get('/unread-count', authentication_1.authentication, notification_service_1.default.unreadCount);
notificationRouter.patch('/:id/read', authentication_1.authentication, notification_service_1.default.readNotification);
exports.default = notificationRouter;

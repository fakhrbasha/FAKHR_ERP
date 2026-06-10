import { Router } from "express";
import { authentication } from "../../common/middleware/authentication";
import notificationService from "./notification.service";
import { validation } from "../../common/middleware/validation";
import * as notificationValidation from "./notification.validation";
const notificationRouter = Router()

notificationRouter.get('/', authentication, notificationService.getNotifications)
notificationRouter.get('/unread-count', authentication, notificationService.unreadCount)
notificationRouter.get('/:id/read', authentication, notificationService.readNotification)

export default notificationRouter
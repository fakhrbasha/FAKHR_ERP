import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import { INotification, NotificationModel } from "../models/notifications.model";


class NotificationRepository extends BaseRepository<INotification> {
    constructor(protected readonly model: Model<INotification> = NotificationModel) {
        super(model)
    }
}

export default NotificationRepository
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const notifications_model_1 = require("../models/notifications.model");
class NotificationRepository extends base_repository_1.default {
    model;
    constructor(model = notifications_model_1.NotificationModel) {
        super(model);
        this.model = model;
    }
}
exports.default = NotificationRepository;

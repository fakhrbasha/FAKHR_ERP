"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const dashboard_service_1 = __importDefault(require("./dashboard.service"));
const dashboardRouter = (0, express_1.Router)();
dashboardRouter.get('/state', authentication_1.authentication, dashboard_service_1.default.getStats);
exports.default = dashboardRouter;

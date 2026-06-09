"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const Reports_service_1 = __importDefault(require("./Reports.service"));
const reportsRouter = (0, express_1.Router)();
reportsRouter.get("/expenses", authentication_1.authentication, Reports_service_1.default.getExpenseReport);
reportsRouter.get("/attendance", authentication_1.authentication, Reports_service_1.default.getAttendanceReport);
reportsRouter.get("/low-stock", authentication_1.authentication, Reports_service_1.default.getLowStockReport);
reportsRouter.get("/purchase-orders", authentication_1.authentication, Reports_service_1.default.getPurchaseOrdersReport);
exports.default = reportsRouter;

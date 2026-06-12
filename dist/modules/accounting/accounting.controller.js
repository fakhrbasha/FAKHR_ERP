"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../common/middleware/authentication");
const accounting_service_1 = __importDefault(require("./accounting.service"));
const authorization_1 = require("../../common/middleware/authorization");
const user_enum_1 = require("../../common/enums/user.enum");
const accountingRouter = (0, express_1.Router)();
accountingRouter.get("/summary", authentication_1.authentication, (0, authorization_1.authorization)(user_enum_1.RoleEnum.ADMIN), accounting_service_1.default.getAccountingSummary);
accountingRouter.get("/monthly-report", authentication_1.authentication, (0, authorization_1.authorization)(user_enum_1.RoleEnum.ADMIN), accounting_service_1.default.getMonthlyReport);
exports.default = accountingRouter;

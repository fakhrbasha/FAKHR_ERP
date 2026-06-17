"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shift_service_1 = __importDefault(require("./shift.service"));
const authentication_1 = require("../../common/middleware/authentication");
const shiftRouter = (0, express_1.Router)();
shiftRouter.post("/", authentication_1.authentication, shift_service_1.default.createShift);
shiftRouter.get("/", authentication_1.authentication, shift_service_1.default.getShifts);
shiftRouter.get("/:id", authentication_1.authentication, shift_service_1.default.getShiftById);
shiftRouter.patch("/:id", authentication_1.authentication, shift_service_1.default.updateShift);
shiftRouter.delete("/:id", authentication_1.authentication, shift_service_1.default.deleteShift);
exports.default = shiftRouter;

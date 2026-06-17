"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const shift_model_1 = __importDefault(require("../models/shift.model"));
class ShiftRepository extends base_repository_1.default {
    constructor() {
        super(shift_model_1.default);
    }
}
exports.default = ShiftRepository;

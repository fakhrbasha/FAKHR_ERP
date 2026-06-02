"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const color_model_1 = __importDefault(require("../models/color.model"));
class ColorRepository extends base_repository_1.default {
    model;
    constructor(model = color_model_1.default) {
        super(model);
        this.model = model;
    }
}
exports.default = ColorRepository;

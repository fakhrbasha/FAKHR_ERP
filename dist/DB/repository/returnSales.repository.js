"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = __importDefault(require("./base.repository"));
const returnSale_model_1 = require("../models/returnSale.model");
class ReturnSalesRepository extends base_repository_1.default {
    model;
    constructor(model = returnSale_model_1.returnSalesModel) {
        super(model);
        this.model = model;
    }
}
exports.default = ReturnSalesRepository;

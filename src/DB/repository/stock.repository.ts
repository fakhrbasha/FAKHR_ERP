import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import colorModel, { IColor } from "../models/color.model";
import stockModel, { IYarnStock } from "../models/stock.model";

class StockRepository extends BaseRepository<IYarnStock> {
    constructor(protected readonly model: Model<IYarnStock> = stockModel) {
        super(model)
    }
}

export default StockRepository
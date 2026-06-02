import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import stockTransactionModel, { IStockTransaction } from "../models/stockTransaction.model";

class StockTransactionRepository extends BaseRepository<IStockTransaction> {
    constructor(protected readonly model: Model<IStockTransaction> = stockTransactionModel) {
        super(model)
    }
}

export default StockTransactionRepository
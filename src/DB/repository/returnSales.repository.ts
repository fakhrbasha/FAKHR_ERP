import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import { ISalesReturn, returnSalesModel } from "../models/returnSale.model";


class ReturnSalesRepository extends BaseRepository<ISalesReturn> {
    constructor(protected readonly model: Model<ISalesReturn> = returnSalesModel) {
        super(model)
    }
}

export default ReturnSalesRepository
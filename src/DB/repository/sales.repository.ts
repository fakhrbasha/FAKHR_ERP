import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import { ISale, SalesModel } from "../models/sales.model";


class SalesRepository extends BaseRepository<ISale> {
    constructor(protected readonly model: Model<ISale> = SalesModel) {
        super(model)
    }
}

export default SalesRepository
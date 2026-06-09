import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import productModel, { IProduct } from "../models/product.model";


class ProductRepository extends BaseRepository<IProduct> {
    constructor(protected readonly model: Model<IProduct> = productModel) {
        super(model)
    }
}

export default ProductRepository
import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import supplierModel, { ISupplier } from "../models/supplier.model";


class SupplierRepository extends BaseRepository<ISupplier> {
    constructor(protected readonly model: Model<ISupplier> = supplierModel) {
        super(model)
    }
}

export default SupplierRepository
import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import materialModel, { IMaterial } from "../models/materials.model";


class MaterialRepository extends BaseRepository<IMaterial> {
    constructor(protected readonly model: Model<IMaterial> = materialModel) {
        super(model)
    }
}

export default MaterialRepository
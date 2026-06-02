import { Model } from "mongoose";
import BaseRepository from "./base.repository";
import colorModel, { IColor } from "../models/color.model";


class ColorRepository extends BaseRepository<IColor> {
    constructor(protected readonly model: Model<IColor> = colorModel) {
        super(model)
    }
}

export default ColorRepository
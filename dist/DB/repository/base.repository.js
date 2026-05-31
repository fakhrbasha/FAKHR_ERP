"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async findOne({ filter, projection, options }) {
        return this.model.findOne(filter, projection, options);
    }
    async find({ filter, projection, options }) {
        return this.model.find(filter, projection)
            .sort(options?.sort)
            .skip(options?.skip)
            .limit(options?.limit)
            .populate(options?.populate);
    }
    async update(filter, data) {
        return await this.model.findOneAndUpdate(filter, data, { new: true }).exec();
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}
exports.default = BaseRepository;

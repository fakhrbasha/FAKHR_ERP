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
    async count(filter = {}) {
        return this.model.countDocuments(filter);
    }
    async paginate({ page, limit, sort, populate, search }) {
        page = +page || 1;
        limit = +limit || 2;
        if (page < 0)
            page = 1;
        if (limit < 0)
            limit = 2;
        const skip = (page - 1) * limit;
        const [data, totalDoc] = await Promise.all([
            this.model.find({ ...(search ?? {}) })
                .skip(skip)
                .limit(limit)
                .populate(populate)
                .sort(sort),
            this.model.countDocuments({ ...(search ?? {}) })
        ]);
        const totalPages = Math.ceil(totalDoc / limit);
        return {
            meta: {
                currentPage: page,
                totalPages,
                limit,
                totalDoc
            },
            data
        };
    }
}
exports.default = BaseRepository;

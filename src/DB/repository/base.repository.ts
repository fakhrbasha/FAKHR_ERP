import { HydratedDocument, Model, PopulateOption, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types } from "mongoose";




abstract class BaseRepository<TDocument> {
    constructor(protected readonly model: Model<TDocument>) { }

    // create
    async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {
        return this.model.create(data)
    }
    // findById
    async findById(id: Types.ObjectId): Promise<HydratedDocument<TDocument> | null> {
        return this.model.findById(id)
    }
    // findOne -> filter,projection,options

    async findOne({
        filter,
        projection,
        options
    }: {
        filter: QueryFilter<TDocument>,
        projection?: ProjectionType<TDocument>,
        options?: QueryOptions<TDocument>
    }): Promise<HydratedDocument<TDocument> | null> {
        return this.model.findOne(filter, projection, options)
    }

    // find
    async find({
        filter,
        projection,
        options
    }: {
        filter: QueryFilter<TDocument>,
        projection?: ProjectionType<TDocument>
        options?: QueryOptions<TDocument>
    }): Promise<HydratedDocument<TDocument>[] | []> {
        return this.model.find(filter, projection)
            .sort(options?.sort)
            .skip(options?.skip!)
            .limit(options?.limit!)
            .populate(options?.populate as PopulateOptions)
    }

    // findOneAndUpdate
    // findOneAndDelete
    // update
    //    async update(
    //         filter: any,
    //         data: Partial<TDocument>
    //     ): Promise<HydratedDocument<TDocument> | null> {
    //         return this.model.findOneAndUpdate(
    //             filter,
    //             data,
    //             { new: true }
    //         );
    //     }
    async update(
        filter: any,
        data: Partial<TDocument>
    ): Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findOneAndUpdate(
            filter,
            data,
            { new: true }
        ).exec();
    }

    async delete(id: Types.ObjectId): Promise<HydratedDocument<TDocument> | null> {
        return this.model.findByIdAndDelete(id);
    }


    async paginate<T>({
        page,
        limit,
        sort,
        populate,
        search
    }: {
        page?: number,
        limit?: number,
        sort?: any,
        populate?: any,
        search?: QueryFilter<T>
    }) {

        page = +page! || 1
        limit = +limit! || 2
        if (page < 0) page = 1
        if (limit < 0) limit = 2
        const skip = (page - 1) * limit

        const [data, totalDoc] = await Promise.all([
            this.model.find({ ...(search ?? {}) })
                .skip(skip)
                .limit(limit)
                .populate(populate)
                .sort(sort),
            this.model.countDocuments({ ...(search ?? {}) })
        ])
        const totalPages = Math.ceil(totalDoc! / limit)

        return {
            meta: {
                currentPage: page,
                totalPages,
                limit,
                totalDoc
            },
            data
        }

    }
}


export default BaseRepository
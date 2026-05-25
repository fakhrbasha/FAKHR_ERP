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
}


export default BaseRepository
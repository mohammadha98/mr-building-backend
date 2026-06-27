import IPagination from "./IPagination";
export default interface IRepository<T> {
    create(params: any): Promise<T>;
    count(params: any): Promise<number>;
    findOne(params: any): Promise<T | null>;
    findOneByID(params: any, relations?: string[]): Promise<T | null>;
    findMany(params: any, relations?: string[], pagination?: IPagination): Promise<T[]>;
    updateOne(where: Partial<T>, updateData: Partial<T>): Promise<any>;
    updateMany(where: Partial<T>, updateData: Partial<T>): Promise<any>;
    deleteOne(where: any): Promise<boolean>;
    deleteMany(where: any): Promise<boolean>;
}

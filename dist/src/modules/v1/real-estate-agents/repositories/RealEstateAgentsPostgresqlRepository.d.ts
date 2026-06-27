import IPagination from "src/commons/contracts/IPagination";
import IRealEstateAgentsRepository from "./IRealEstateAgentsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
export default class RealEstateAgentsPostgresqlRepository implements IRealEstateAgentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findNewItems(params: any, select: any, pagination?: IPagination): Promise<any[] | []>;
    count(params: any): Promise<number>;
    findByStatus(status: string): Promise<any[] | []>;
    create(params: any): Promise<any>;
    findOne(params: any): Promise<any>;
    findOneByID(id: number): Promise<any>;
    findMany(params: any, relations?: string[], pagination?: IPagination): Promise<any[]>;
    updateOne(where: any, updateData: any): Promise<any>;
    updateMany(where: Partial<any>, updateData: Partial<any>): Promise<any>;
    deleteOne(where: any): Promise<any>;
    deleteMany(where: any): Promise<any>;
}

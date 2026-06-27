import IPagination from "src/commons/contracts/IPagination";
import IrealEstateAgentCommentsRepository from "./IRealEstateAgentsCommentsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
export default class RealEstateAgentsCommentsPostgresqlRepository implements IrealEstateAgentCommentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
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

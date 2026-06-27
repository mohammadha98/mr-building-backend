import IPagination from "src/commons/contracts/IPagination";
import IrealEstateAdsSettingsRepository from "./IRealEstateAdsFormsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
export default class RealEstateAdsFormsPostgresqlRepository implements IrealEstateAdsSettingsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    saveItem(body: any): Promise<{
        id: string;
        field_name: string;
        field_type: string;
        values: string[];
        icon: string;
        key: string;
    }>;
    count(params: any): Promise<number>;
    create(params: any): Promise<any>;
    findOne(params: any): Promise<any>;
    findOneByID(id: string): Promise<any>;
    findMany(params: any, relations?: string[], pagination?: IPagination): Promise<any[]>;
    updateOne(where: any, updateData: any): Promise<any>;
    updateMany(where: Partial<any>, updateData: Partial<any>): Promise<any>;
    deleteOne(where: any): Promise<any>;
    deleteMany(where: any): Promise<any>;
    findOneItem(params: any): Promise<any>;
    findManyItems(params: any): Promise<any[]>;
    updateOneItem(where: any, updateData: any): Promise<any>;
    deleteOneItem(where: any): Promise<any>;
    deleteManyItem(where: any): Promise<any>;
}

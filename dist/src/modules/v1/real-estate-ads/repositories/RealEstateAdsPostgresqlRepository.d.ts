import IPagination from "src/commons/contracts/IPagination";
import IRealEstateAdsRepository from "./IRealEstateAdsRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { DeleteRealEstateMediaItemDto } from "../app/dto/delete-media-item.dto";
export default class RealEstateAdsPostgresqlRepository implements IRealEstateAdsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createItem(params: any): Promise<any>;
    changeStatus(where: any, data: any): Promise<any>;
    createMedia(params: any): Promise<any>;
    getMedia(ad_id: number): Promise<any[]>;
    removeMedia(item_id: number): Promise<any>;
    removeAllMedia(ad_id: number): Promise<any>;
    removeItems(ad_id: number): Promise<any>;
    deleteManyItems(ad_id: number): Promise<any>;
    SaveRealEstateAdsTempFiles(file_type: string, file: string, thumbnail: string): Promise<{
        id: number;
        file_name: string;
        file_type: string;
        thumbnail: string;
    }>;
    changePriorityFilesToNormal(ad_id: number): Promise<void>;
    saveMedia(ad_id: number, file_type: string, file: string, thumbnail: string): Promise<{
        id: number;
        file_name: string;
        file_type: string;
        thumbnail: string;
    }>;
    findMedia(id: number): Promise<any>;
    getFileInfo(query: DeleteRealEstateMediaItemDto): Promise<any>;
    deleteTempFile(id: number): Promise<any>;
    count(params: any): Promise<number>;
    findByStatus(status: string): Promise<any[] | []>;
    create(params: any): Promise<any>;
    updateOne(where: any, params: any): Promise<any>;
    findOne(params: any): Promise<any>;
    findOneByID(id: number): Promise<any>;
    findMany(params: any, relations?: string[], pagination?: IPagination): Promise<any[]>;
    updateMany(where: Partial<any>, updateData: Partial<any>): Promise<any>;
    deleteOne(ad_id: number): Promise<any>;
    deleteMany(where: any): Promise<any>;
}

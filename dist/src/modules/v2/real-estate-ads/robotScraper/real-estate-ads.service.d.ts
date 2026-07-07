import { PrismaService } from "src/../prisma/prisma.service";
import { CreateRealEstateAdRobotScraperDto, DownloadFileUrl } from "./dto/create-real-estate-roborScraper-ads.dto";
export declare class RealEstateAdsService_robotScraper {
    private readonly prismaService;
    private readonly uploadService;
    constructor(prismaService: PrismaService);
    storeAd(body: CreateRealEstateAdRobotScraperDto): Promise<{
        status: number;
        result: {
            id: number;
        };
    } | {
        status: number;
        result?: undefined;
    }>;
    getCategories(): Promise<{
        status: number;
        result: {
            id: string;
            title: string;
            status: string;
            type: string;
            RealEstateAdSubCategory: {
                id: string;
                title: string;
            }[];
        }[];
    } | {
        status: number;
        result?: undefined;
    }>;
    downloadFile(body: DownloadFileUrl): Promise<{
        fileUrl: string;
        dest: string;
        filename: string;
    }>;
    private generateTrackingCode;
}

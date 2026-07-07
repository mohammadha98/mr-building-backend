import { HttpStatus } from "@nestjs/common";
import { BannerSliderDto } from "./dto/banner-slider.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationSchema } from "src/commons/contracts//PaginationSchema";
import BannerTransformerAdmin from "./contracts/transformer-admin";
import { PublicMessage } from "src/commons/enums/messages";
export declare class BannerService {
    private readonly prisma;
    private readonly bannerTransformer;
    private readonly uploaderService;
    constructor(prisma: PrismaService, bannerTransformer: BannerTransformerAdmin);
    create(createSliderDto: BannerSliderDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {
            id: any;
            title: any;
            tag: any;
            url: any;
            thumbnail: string;
            created_at: any;
        };
    }>;
    findAll(pagination: PaginationSchema): Promise<{
        banners: {
            id: any;
            title: any;
            tag: any;
            url: any;
            thumbnail: string;
            created_at: any;
        }[];
        metadata: {
            page: number;
            per_page: number;
            total_page: number;
            next: boolean;
            back: boolean;
        };
    }>;
    update(body: UpdateBannerDto): Promise<{
        statusCode: number;
        message: PublicMessage;
        data: {
            id: any;
            title: any;
            tag: any;
            url: any;
            thumbnail: string;
            created_at: any;
        };
    }>;
    remove(id: number): Promise<{
        statusCode: number;
        message: PublicMessage;
    }>;
}

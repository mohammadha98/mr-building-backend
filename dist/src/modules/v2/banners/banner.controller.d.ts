/// <reference types="multer" />
import { BannerService } from "./banner.service";
import { BannerSliderDto } from "./dto/banner-slider.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    create(createSliderDto: BannerSliderDto, thumbnail: Express.Multer.File): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../commons/enums/messages").PublicMessage;
        data: {
            id: any;
            title: any;
            tag: any;
            url: any;
            thumbnail: string;
            created_at: any;
        };
    }>;
    findAll(query: PaginationSchema): Promise<{
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
    update(body: UpdateBannerDto, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: import("../../../commons/enums/messages").PublicMessage;
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
        message: import("../../../commons/enums/messages").PublicMessage;
    }>;
}

import { InwardMarketStatsService } from "./inward-market-stats.service";
export declare class InwardMarketStatsController {
    private readonly inwardMarketStatsService;
    constructor(inwardMarketStatsService: InwardMarketStatsService);
    findAll(): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            gold: (import("@prisma/client/runtime").GetResult<{
                id: string;
                type: string;
                key: number;
                category: string;
                title: string;
                price: string;
                variation: string;
                max: string;
                min: string;
                created_at: Date;
            }, unknown, never> & {})[];
            coin: (import("@prisma/client/runtime").GetResult<{
                id: string;
                type: string;
                key: number;
                category: string;
                title: string;
                price: string;
                variation: string;
                max: string;
                min: string;
                created_at: Date;
            }, unknown, never> & {})[];
            currency: (import("@prisma/client/runtime").GetResult<{
                id: string;
                type: string;
                key: number;
                category: string;
                title: string;
                price: string;
                variation: string;
                max: string;
                min: string;
                created_at: Date;
            }, unknown, never> & {})[];
        };
    }>;
}

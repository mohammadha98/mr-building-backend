import { HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { PublicMessage } from "src/commons/enums/messages";
export declare class InwardMarketStatsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
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
    private getGolds;
    private getCoins;
    private getCurrency;
}

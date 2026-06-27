import { PrismaService } from "../../../../../prisma/prisma.service";
export declare class TermsOfServicesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findAll(): Promise<{
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: number;
            content: string;
            key: string;
            created_at: Date;
        }, unknown, never> & {};
    } | {
        status: number;
        result?: undefined;
    }>;
}

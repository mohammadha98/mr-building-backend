import { CreateServiceMediaDto } from "./dto/create-service-media-module.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { CreateServiceDto } from "./dto/create-service.dto";
export declare class ServiceModulesService {
    private readonly prismaService;
    private readonly uploadService;
    constructor(prismaService: PrismaService);
    saveServiceInfo(body: CreateServiceDto): Promise<{
        status: number;
        result: any;
    } | {
        status: number;
        result?: undefined;
    }>;
    create(body: CreateServiceMediaDto): Promise<{
        status: number;
        result: {
            id: string;
            type: string;
            fileType: string;
            file: string;
        };
    } | {
        status: number;
        result?: undefined;
    }>;
    findAll(query: GetServicesMediaDto): Promise<{
        status: number;
        service?: undefined;
    } | {
        status: number;
        service: {
            info: {
                id: string;
                description: string;
            };
            media: {
                id: string;
                type: string;
                fileType: string;
                file: string;
            }[];
        };
    }>;
    remove(id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            type: string;
            fileType: string;
            file: string;
            creatorID: number;
        }, unknown, never> & {};
    }>;
}

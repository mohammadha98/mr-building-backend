import { PrismaService } from "../../../../../prisma/prisma.service";
import { MyCityModel } from "@prisma/client";
import { PublicMessage } from "src/commons/enums/messages";
import { Request } from "express";
import UploadService from "src/modules/services/UploadService";
import MyCityTransformer from "./Transformer";
import { HttpStatusCode } from "axios";
export declare class MyCityService {
    private request;
    private readonly prismaService;
    private readonly uploadService;
    private readonly myCityTransformer;
    constructor(request: Request, prismaService: PrismaService, uploadService: UploadService, myCityTransformer: MyCityTransformer);
    findAll(query: any): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            data: {
                id: any;
                client: {
                    id: any;
                    name: any;
                    surname: any;
                    phone: any;
                };
                category: any;
                province: {
                    id: any;
                    name: any;
                };
                city: {
                    id: any;
                    name: any;
                };
                title: any;
                latitude: any;
                longitude: any;
                status: any;
            }[];
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    locationDetails(id: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            id: any;
            client: {
                id: any;
                name: any;
                surname: any;
                phone: any;
            };
            category: any;
            title: any;
            description: any;
            size: any;
            number_of_rooms: any;
            renovation_tax: any;
            latitude: any;
            longitude: any;
            status: any;
            province: {
                id: any;
                name: any;
            };
            city: {
                id: any;
                name: any;
            };
            files: {
                id: any;
                file_name: any;
                tag: any;
                file_type: any;
                file_url: string;
                sort_number: any;
                priority: any;
                thumbnail: string;
            }[];
        };
    }>;
    findOne(id: string): Promise<MyCityModel>;
    getDetails(id: string): Promise<MyCityModel>;
    remove(id: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    changeStatus(id: string, status: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
}

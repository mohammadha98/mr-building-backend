import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateMyCityDto, UploadFileMyCityDto } from "./dto/create-my-city.dto";
import { MyCityModel } from "@prisma/client";
import { MayNearDto } from "./dto/find-my-near.dto";
import { UpdateMyCityDto } from "./dto/update-my-city.dto";
import { UpdateLocationInMyCity } from "./dto/update-location-my-city.dto";
import { PublicMessage } from "src/commons/enums/messages";
import { Request } from "express";
import UploadService from "src/modules/services/UploadService";
import MyCityTransformer from "./Transformer";
import { HttpStatusCode } from "axios";
import { PaginationDto } from "src/commons/dto/pagination.dto";
export declare class MyCityService {
    private request;
    private readonly prismaService;
    private readonly uploadService;
    private readonly myCityTransformer;
    constructor(request: Request, prismaService: PrismaService, uploadService: UploadService, myCityTransformer: MyCityTransformer);
    UploadFile(body: UploadFileMyCityDto): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            id: any;
            file_name: any;
            tag: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: string;
        };
    }>;
    create(createGeolocationDto: CreateMyCityDto): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    findAll(query: any): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            data: {
                id: any;
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
            is_favorite: boolean;
            category: any;
            title: any;
            description: any;
            size: any;
            year_built: any;
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
    findNearLocations(mayNearDto: MayNearDto): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            id: any;
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
    }>;
    myLocations(query: PaginationDto): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            data: {
                id: any;
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
    findOne(id: string): Promise<MyCityModel>;
    getDetails(id: string, client_id: number): Promise<MyCityModel>;
    update(id: string, updateGeolocationDto: UpdateMyCityDto): Promise<boolean>;
    updateLocationInMyCity(id: string, body: UpdateLocationInMyCity): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    removeFile(id: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    changePriorityFile(id: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    private generateThumbnailForVideo;
    private generateThumbnailForImage;
}

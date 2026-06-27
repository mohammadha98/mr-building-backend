/// <reference types="multer" />
import { MyCityService } from "./my-city.service";
import { CreateMyCityDto, UploadFileMyCityDto } from "./dto/create-my-city.dto";
import { UpdateLocationInMyCity } from "./dto/update-location-my-city.dto";
import { UpdateMyCityDto } from "./dto/update-my-city.dto";
import { GetLocaionInMyCity } from "./dto/query-geolocation.dto";
import { MayNearDto } from "./dto/find-my-near.dto";
import { PaginationDto } from "src/commons/dto/pagination.dto";
export declare class MyCityController {
    private readonly myCityService;
    constructor(myCityService: MyCityService);
    UploadTempFile(body: UploadFileMyCityDto, file: Express.Multer.File): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    findAll(query: GetLocaionInMyCity): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    findAllMe(query: PaginationDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    findNear(body: MayNearDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    locationDetails(id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    updateLocationInMyCity(id: string, body: UpdateLocationInMyCity): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    update(id: string, updateGeolocationDto: UpdateMyCityDto): Promise<boolean>;
    remove(id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    removeFile(id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    changePriorityFile(id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
}

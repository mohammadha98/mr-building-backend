import { MyCityService } from "./my-city.service";
import { GetLocaionInMyCity } from "./dto/query-geolocation.dto";
export declare class MyCityController {
    private readonly myCityService;
    constructor(myCityService: MyCityService);
    findAll(query: GetLocaionInMyCity): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    remove(id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    changePriorityFile(id: string, status: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
}

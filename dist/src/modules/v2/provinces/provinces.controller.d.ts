import { ProvincesService } from "./provinces.service";
export declare class ProvincesController {
    private readonly provincesService;
    private readonly responseHandler;
    constructor(provincesService: ProvincesService);
    findAll(): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: number;
            name: string;
            cities: {
                id: number;
                name: string;
            }[];
        }[];
    }>;
    findProvinces(): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: number;
            name: string;
        }[];
    }>;
}

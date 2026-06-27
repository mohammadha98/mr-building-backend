/// <reference types="multer" />
import { ServiceModulesService } from "./service-modules.service";
import { CreateServiceMediaDto } from "./dto/create-service-media-module.dto";
import ServicesModuleAdminTransformer from "./Transformer";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { CreateServiceDto } from "./dto/create-service.dto";
export declare class ServiceModulesController {
    private readonly serviceModulesService;
    private readonly transformer;
    private readonly httpResponsehandler;
    constructor(serviceModulesService: ServiceModulesService, transformer: ServicesModuleAdminTransformer);
    saveServiceInfo(body: CreateServiceDto, req: any, res: Response): Promise<any>;
    saveNewMedia(body: CreateServiceMediaDto, req: any, res: Response, file: Express.Multer.File): Promise<any>;
    findAll(query: GetServicesMediaDto, req: any, res: Response): Promise<any>;
    remove(id: string, req: any, res: Response): Promise<any>;
}

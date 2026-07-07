/// <reference types="multer" />
import { UploaderService } from "./uploader.service";
import { CreateUploaderDto } from "./dto/create-uploader.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
export declare class UploaderController {
    private readonly uploaderService;
    private readonly responseHandler;
    constructor(uploaderService: UploaderService, responseHandler: HttpResponsehandler);
    uploaderFile(body: CreateUploaderDto, file: Express.Multer.File, req: any, res: Response): Promise<any>;
}

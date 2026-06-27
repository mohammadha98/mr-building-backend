/// <reference types="multer" />
import { ReportsService } from "./report.service";
import { CreateReportBugDto } from "./dto/create-report-bugs.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { CreateReportViolationDto } from "./dto/create-report-violation.dto";
export declare class ReportsController {
    private readonly responseHandler;
    private readonly reportBugsService;
    constructor(responseHandler: HttpResponsehandler, reportBugsService: ReportsService);
    storeBug(body: CreateReportBugDto, req: any, res: Response, files: {
        image?: Express.Multer.File;
        voice?: Express.Multer.File;
    }): Promise<any>;
    storeViolation(body: CreateReportViolationDto, req: any, res: Response): Promise<any>;
}

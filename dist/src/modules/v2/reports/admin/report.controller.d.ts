import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ReportService } from "./report.service";
import ReportsTransformer from "./Transformer";
import { GetReportsViolationsDto } from "./dto/get-reports-violations.dto";
export declare class ReportController {
    private readonly responseHandler;
    private readonly reportBugsService;
    private readonly transformer;
    constructor(responseHandler: HttpResponsehandler, reportBugsService: ReportService, transformer: ReportsTransformer);
    getAll(query: PaginationDto, req: any, res: Response): Promise<any>;
    single(id: number, req: any, res: Response): Promise<any>;
    getAllViolations(query: GetReportsViolationsDto, req: any, res: Response): Promise<any>;
}

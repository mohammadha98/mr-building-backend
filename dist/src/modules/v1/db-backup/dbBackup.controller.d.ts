import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { DbBackupService } from "./dbBackup.service";
import BackupTransformer from "./Transformer";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
export declare class DbBackupController {
    private readonly backupsService;
    private readonly backupTransFormer;
    private readonly responseHandler;
    constructor(backupsService: DbBackupService, backupTransFormer: BackupTransformer, responseHandler: HttpResponsehandler);
    saveNewBackup(): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: import("../../../commons/enums/messages").PublicMessage;
        data: {
            id: any;
            link: string;
            created_at: string;
        };
    }>;
    createZipPublicDir(res: Response, req: any): Promise<any>;
    getBackupList(qeury: PaginationDto, res: Response, req: any): Promise<any>;
}

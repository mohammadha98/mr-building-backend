import { AdminReportTypes } from "../enums/admin-report-types.enum";
import Statuses from "src/commons/contracts/Statuses";
export declare class AdminReportsDto {
    period: AdminReportTypes;
    status?: Statuses;
}

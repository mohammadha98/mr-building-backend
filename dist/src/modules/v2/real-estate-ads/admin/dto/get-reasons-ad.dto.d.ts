import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ReasonAdTypes } from "../enums/ReasonAdTypes";
export declare class GetReasonsAdDto extends PaginationDto {
    reason_type: ReasonAdTypes;
}

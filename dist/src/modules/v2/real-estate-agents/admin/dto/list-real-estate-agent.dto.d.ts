import statuses from "src/commons/contracts/Statuses";
import { GetTypes } from "../../../client/admin/dto/client-list.dto";
export declare enum RealEstateAgentSort {
    newest = "newest",
    oldest = "oldest"
}
export declare class ListRealEstateAgentDto {
    user_id: number;
    status: statuses;
    type: GetTypes;
    keyword: string;
    sort: RealEstateAgentSort;
    province_id: string;
    page: string;
    per_page: string;
}

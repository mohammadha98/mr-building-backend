import { GetTypes } from "../enums/Sorting-admin.enum";
export declare class PaginationDto {
    user_id: number;
    status: string;
    type: GetTypes;
    keyword: string;
    sort: string;
    page: string;
    per_page: string;
}

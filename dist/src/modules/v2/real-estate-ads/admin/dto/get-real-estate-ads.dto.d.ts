import { GetTypes } from "../../../client/admin/dto/client-list.dto";
export declare class GetRealEstateAdDto {
    user_id: number;
    type: GetTypes;
    keyword: string;
    sub_category: string;
    province_id: string;
    status: string;
    sort: string;
    page: number;
    per_page: number;
}

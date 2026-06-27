import Statuses from "src/commons/contracts/Statuses";
import { MarketplaceStorefrontSort } from "../../app/dto/list-storefront.dto";
import { GetTypes } from "../../../client/admin/dto/client-list.dto";
export declare class ListStorefrontsDto {
    user_id: number;
    status: Statuses;
    type: GetTypes;
    keyword: string;
    sort: MarketplaceStorefrontSort;
    page: string;
    per_page: string;
}

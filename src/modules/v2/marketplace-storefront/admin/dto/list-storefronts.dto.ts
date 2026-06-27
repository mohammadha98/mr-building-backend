import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString } from "class-validator";
import Statuses from "src/commons/contracts/Statuses";
import { MarketplaceStorefrontSort } from "../../app/dto/list-storefront.dto";
import { GetTypes } from "../../../client/admin/dto/client-list.dto";

export class ListStorefrontsDto {
  user_id: number;

  @ApiProperty({ enum: Statuses, default: Statuses.all })
  @IsEnum(Statuses)
  status: Statuses;

  @ApiProperty({ enum: GetTypes, default: GetTypes.normal, required: false })
  type: GetTypes;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({
    enum: MarketplaceStorefrontSort,
    default: MarketplaceStorefrontSort.newest,
  })
  @IsEnum(MarketplaceStorefrontSort)
  sort: MarketplaceStorefrontSort;

  @ApiProperty({ default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ default: 12 })
  @IsNumberString()
  per_page: string;
}

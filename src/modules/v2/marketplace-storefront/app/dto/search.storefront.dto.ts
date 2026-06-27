import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString, IsString } from "class-validator";
import { MarketplaceStorefrontSort } from "./list-storefront.dto";

export class SearchForRealEstateAgentDto {
  client_id: number;
  @ApiProperty()
  @IsString()
  keyword: string;

  @ApiProperty({
    enum: MarketplaceStorefrontSort,
    default: MarketplaceStorefrontSort.newest,
  })
  @IsEnum(MarketplaceStorefrontSort)
  sort: MarketplaceStorefrontSort;

  @ApiProperty({ type: "integer" })
  @IsNumberString()
  province_id: number;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: number;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: number;
}

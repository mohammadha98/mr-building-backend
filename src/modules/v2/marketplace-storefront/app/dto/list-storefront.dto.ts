import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString, IsString } from "class-validator";

export enum MarketplaceStorefrontSort {
  newest = "newest",
  oldest = "oldest",
  best_selling = "best_selling",
  most_chosen = "most_chosen",
}

export class ListStorefrontDto {
  user_id: number;

  @ApiProperty({ default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ default: 12 })
  @IsNumberString()
  per_page: string;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({ required: false })
  category_id: string;

  @ApiProperty({ required: true })
  province_id: string;

  @ApiProperty({ required: false })
  city_id: string;

  @ApiProperty({
    enum: MarketplaceStorefrontSort,
    default: MarketplaceStorefrontSort.newest,
  })
  @IsEnum(MarketplaceStorefrontSort)
  sort: MarketplaceStorefrontSort;
}

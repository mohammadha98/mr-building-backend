import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import SortingTypes from "src/commons/contracts/SortingTypes";
import { GetProductTypes } from "../../../marketplace-storefront/app/dto/get-product.dto";

export enum GetProductMarketplaceTypes {
  all = "all",
  category = "category",
  sub_category = "sub_category",
  brand = "brand",
}

export class GetProductsInMarketplaceDto extends PaginationDto {
  @ApiProperty({
    enum: GetProductMarketplaceTypes,
    default: GetProductMarketplaceTypes.category,
  })
  @IsEnum(GetProductMarketplaceTypes)
  type: GetProductMarketplaceTypes;

  @ApiProperty({ enum: GetProductTypes, default: GetProductTypes.normal })
  @IsEnum(GetProductTypes)
  action: GetProductTypes;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty()
  province_id: string;

  @ApiProperty({ required: false })
  city_id: string;

  @ApiProperty({
    enum: SortingTypes,
    default: SortingTypes.newest,
  })
  @IsEnum(SortingTypes)
  sort: SortingTypes;

  @ApiProperty({ required: false })
  item_id: string;
}

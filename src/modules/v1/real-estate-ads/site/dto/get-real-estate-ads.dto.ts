import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import RealEstateAdTypes from "src/commons/contracts/RealEstateAdTypes";
import SortingTypes from "src/commons/contracts/SortingTypes";

export enum SelectedAdStatus {
  all = "all",
  search = "search",
  individual = "individual",
  real_estate_agent = "real_estate_agent",
}

export class GetRealEstateAdDto {
  client_id: number;
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  category_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sub_category_id: string;

  @ApiProperty({
    enum: RealEstateAdTypes,
    title: "type",
    default: RealEstateAdTypes.sale,
    example: `${RealEstateAdTypes.sale}, ${RealEstateAdTypes.rent}, ${RealEstateAdTypes.short_rent}, ${RealEstateAdTypes.participation}`,
  })
  type: string;

  @ApiProperty({
    enum: SelectedAdStatus,
    title: "tag",
    default: SelectedAdStatus.all,
  })
  tag: string;

  @ApiProperty({
    enum: SortingTypes,
    title: "sort",
    required: false,
    default: SortingTypes.newest,
  })
  @IsOptional()
  sort: string;

  @ApiProperty({ required: false })
  @IsOptional()
  province_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  city_id: number;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  page: number;

  @ApiProperty({ default: 12 })
  @IsOptional()
  per_page: number;
}

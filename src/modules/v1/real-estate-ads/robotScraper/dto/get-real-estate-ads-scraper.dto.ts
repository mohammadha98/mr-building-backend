import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import SortingTypes from "src/commons/contracts/SortingTypes";

export enum SelectedAdStatus {
  general_ads = "general_ads",
  general_search = "general_search",
}

export class GetRealEstateAdScraperDto {
  @ApiProperty({
    enum: SelectedAdStatus,
    title: "tag",
    default: SelectedAdStatus.general_ads,
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
  keyword: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  page: number;

  @ApiProperty({ default: 12 })
  @IsOptional()
  per_page: number;
}

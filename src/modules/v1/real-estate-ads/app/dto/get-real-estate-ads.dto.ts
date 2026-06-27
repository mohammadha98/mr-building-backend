import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import RealEstateAdTypes from "src/commons/contracts/RealEstateAdTypes";
import SortingTypes from "src/commons/contracts/SortingTypes";
import statuses from "src/commons/contracts/Statuses";

export enum SelectedAdStatus {
  all = "all",
  search = "search",
  me = "me",
  individual = "individual",
  real_estate_agent = "real_estate_agent",
  advisor = "advisor",
  general_search = "general_search",
}

export class GetRealEstateAdDto {
  client_id: number;

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
  })
  type: string;

  @ApiProperty({
    enum: SelectedAdStatus,
    title: "tag",
    default: SelectedAdStatus.me,
  })
  tag: string;

  @ApiProperty({
    enum: statuses,
    title: "status",
    default: statuses.all,
  })
  status: string;

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
  agent_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  advisor_id: number;
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

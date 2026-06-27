import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import SortingTypes from "src/commons/contracts/SortingTypes";
import statuses from "src/commons/contracts/Statuses";
import { GetTypes } from "../../../client/admin/dto/client-list.dto";

enum SelectedAdStatus {
  all = "all",
  me = "me",
  real_estate_agent = "real_estate_agent",
}

export class GetRealEstateAdDto {
  user_id: number;

  @ApiProperty({ enum: GetTypes, default: GetTypes.normal, required: false })
  type: GetTypes;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({ required: false, nullable: true, default: null })
  sub_category: string;

  @ApiProperty({ required: false, nullable: true, default: null })
  province_id: string;

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

  // @ApiProperty({ required: false })
  // @IsOptional()
  // province_id: number;
  //
  // @ApiProperty({ required: false })
  // @IsOptional()
  // city_id: number;
  //
  // @ApiProperty({ required: false })
  // @IsOptional()
  // agent_id: number;

  @ApiProperty({ default: 1 })
  @IsOptional()
  page: number;

  @ApiProperty({ default: 12 })
  @IsOptional()
  per_page: number;
}

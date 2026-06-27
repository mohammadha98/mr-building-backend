import { ApiProperty } from "@nestjs/swagger";
import Statuses from "src/commons/contracts/Statuses";
import { IsEnum } from "class-validator";
import SortingTypes from "src/commons/contracts/SortingTypes";

export enum GetProductTypes {
  normal = "normal",
  search = "search",
}

export class GetProductDto {
  client_id: number;

  @ApiProperty({ enum: GetProductTypes, default: GetProductTypes.normal })
  @IsEnum(GetProductTypes)
  type: GetProductTypes;

  @ApiProperty()
  storefront_id: string;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({ default: 1 })
  page: number;

  @ApiProperty({ default: 12 })
  per_page: number;

  @ApiProperty({ enum: Statuses, default: Statuses.active })
  @IsEnum(Statuses)
  status: string;

  @ApiProperty({ enum: SortingTypes, default: SortingTypes.newest })
  @IsEnum(SortingTypes)
  sort: string;
}

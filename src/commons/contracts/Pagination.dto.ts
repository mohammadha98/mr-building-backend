import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";
import Statuses from "./Statuses";
import { GetTypes, SortingAdminEnum } from "../enums/Sorting-admin.enum";

export class PaginationDto {
  user_id: number;

  @ApiProperty({
    enum: Statuses,
    type: "string",
    default: Statuses.all,
    required: false
  })
  @IsOptional()
  status: string;

  @ApiProperty({ enum: GetTypes, default: GetTypes.normal, required: false })
  type: GetTypes;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({
    enum: SortingAdminEnum,
    default: SortingAdminEnum.newest
  })
  sort: string;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: string;
}

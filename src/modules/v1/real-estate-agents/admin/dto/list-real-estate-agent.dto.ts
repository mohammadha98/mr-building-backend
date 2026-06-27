import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString } from "class-validator";
import statuses from "src/commons/contracts/Statuses";
import { GetTypes } from "../../../client/admin/dto/client-list.dto";

export enum RealEstateAgentSort {
  newest = "newest",
  oldest = "oldest",
}

export class ListRealEstateAgentDto {
  user_id: number;

  @ApiProperty({ enum: statuses, default: statuses.pending })
  @IsEnum(statuses)
  status: statuses;

  @ApiProperty({ enum: GetTypes, default: GetTypes.normal, required: false })
  type: GetTypes;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({
    enum: RealEstateAgentSort,
    default: RealEstateAgentSort.newest,
  })
  sort: RealEstateAgentSort;

  @ApiProperty({ required: false })
  province_id: string;

  @ApiProperty({ default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ default: 12 })
  @IsNumberString()
  per_page: string;
}

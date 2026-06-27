import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ReasonAdTypes } from "../enums/ReasonAdTypes";
import { IsEnum } from "class-validator";

export class GetReasonsAdDto extends PaginationDto {
  @ApiProperty({ enum: ReasonAdTypes })
  @IsEnum(ReasonAdTypes)
  reason_type: ReasonAdTypes;
}

import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { AdminReportTypes } from "../enums/admin-report-types.enum";
import Statuses from "src/commons/contracts/Statuses";

export class AdminReportsDto {
  @ApiProperty({
    enum: AdminReportTypes,
    default: AdminReportTypes.Daily,
  })
  @IsEnum(AdminReportTypes)
  period: AdminReportTypes;

  @ApiProperty({
    enum: Statuses,
    default: Statuses.active,
    required: false,
    example: `${Statuses.all},${Statuses.pending}, ${Statuses.approved}, ${Statuses.rejected}, ${Statuses.sold_out}, ${Statuses.invalidate}, ${Statuses.inactive}`,
  })
  @IsOptional()
  status?: Statuses;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString } from "class-validator";
import ReportTypes from "src/commons/contracts/ReportTypes";

export class ClientReportsPaginationDto {
  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  client_id: string;

  @ApiProperty({ enum: ReportTypes, default: ReportTypes.all })
  @IsEnum(ReportTypes)
  type: string;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: string;
}

import { ApiProperty } from "@nestjs/swagger";
import ServicesTypes from "src/commons/contracts/ServicesTypes";
import ReportTypes from "src/commons/contracts/ReportTypes";

export class CreateReportBugDto {
  client_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: ReportTypes, default: ReportTypes.bug })
  type: string;

  @ApiProperty({ enum: ServicesTypes, default: ServicesTypes.general })
  source: string;

  @ApiProperty({
    name: "image",
    type: "string",
    format: "binary",
    required: false,
  })
  image: string;

  @ApiProperty({
    name: "voice",
    type: "string",
    format: "binary",
    required: false,
  })
  voice: string;
}

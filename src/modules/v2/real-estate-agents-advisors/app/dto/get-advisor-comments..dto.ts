import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

enum commentStatus {
  all = "all",
  approved = "approved",
}
export class GetAdvisorCommentsDto {
  client_id: number;
  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  advisor_id: number;

  @ApiProperty({
    enum: commentStatus,
    type: "string",
    default: commentStatus.all,
  })
  status: string;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: number;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: number;
}

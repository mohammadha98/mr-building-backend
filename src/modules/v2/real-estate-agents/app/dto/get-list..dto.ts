import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class GetCommentsListForRealEstateAgentDto {
  client_id: number;
  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  agent_id: number;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: number;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: number;
}

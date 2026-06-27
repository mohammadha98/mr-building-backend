import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";
import statuses from "src/commons/contracts/Statuses";

export class GetCommentsListForRealEstateAgentDto {
  user_id: number;

  @ApiProperty({ enum: statuses, type: "string", default: statuses.active })
  status: string;

  @ApiProperty({ type: "integer", default: 1, required: false })
  @IsNumberString()
  @IsOptional()
  agent_id: number;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: number;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: number;
}

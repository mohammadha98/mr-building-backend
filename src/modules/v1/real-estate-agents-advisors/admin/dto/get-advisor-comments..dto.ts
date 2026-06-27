import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";
import statuses from "src/commons/contracts/Statuses";

export class GetAdvisorCommentsDto {
  user_id: number;

  @ApiProperty({
    enum: statuses,
    type: "string",
    default: statuses.all,
  })
  status: string;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: number;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: number;
}

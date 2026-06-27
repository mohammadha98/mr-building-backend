import { ApiProperty } from "@nestjs/swagger";
import statuses from "src/commons/contracts/Statuses";

export class ChangeStatusAdvisorsDto {
  client_id: number;
  advisor_id: number;

  @ApiProperty()
  comment_id: number;

  @ApiProperty({
    enum: statuses,
    default: statuses.inactive,
    example: "approved,rejected",
  })
  status: string;
}

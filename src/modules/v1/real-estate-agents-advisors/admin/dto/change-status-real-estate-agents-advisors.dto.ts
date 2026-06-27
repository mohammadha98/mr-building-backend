import { ApiProperty } from "@nestjs/swagger";
import statuses from "src/commons/contracts/Statuses";

export class ChangeStatusAdvisorsDto {
  client_id: number;
  advisor_id: number;

  @ApiProperty({ enum: statuses, type: "string", default: statuses.approved })
  status: string;

  @ApiProperty({ type: "integer", required: true, isArray: true })
  items: number[];
}

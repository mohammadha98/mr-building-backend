import { ApiProperty } from "@nestjs/swagger";
import statuses from "src/commons/contracts/Statuses";

export class GetRealEstateAgentsAdvisorsDto {
  client_id: number;

  @ApiProperty()
  agent_id: number;

  @ApiProperty({
    enum: statuses,
    default: statuses.all,
    example: "active,inactive",
  })
  status: string;
}

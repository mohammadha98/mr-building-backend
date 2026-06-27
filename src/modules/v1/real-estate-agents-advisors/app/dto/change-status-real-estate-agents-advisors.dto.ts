import { ApiProperty } from "@nestjs/swagger";
import statuses from "src/commons/contracts/Statuses";

export class ChangeStatusRealEstateAgentsAdvisorsDto {
  client_id: number;

  @ApiProperty()
  advisor_id: number;

  @ApiProperty({
    enum: statuses,
    default: statuses.inactive,
    example: "active,inactive",
  })
  status: string;
}

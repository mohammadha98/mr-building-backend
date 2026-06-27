import { ApiProperty } from "@nestjs/swagger";
import statuses from "src/commons/contracts/Statuses";

export class ChangeStatusRealEstateAdminsAdminsDto {
  client_id: number;

  @ApiProperty()
  admin_id: number;

  @ApiProperty({
    enum: statuses,
    default: statuses.inactive,
    example: "active,inactive",
  })
  status: string;
}

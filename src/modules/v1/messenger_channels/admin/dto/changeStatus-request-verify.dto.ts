import { ApiProperty } from "@nestjs/swagger";
import Statuses from "src/commons/contracts/Statuses";

export class ChangeStatusRequestVerifyDto {
  user_id: number;

  @ApiProperty({ isArray: true, type: "string" })
  requestIds: string[];

  @ApiProperty({ type: "boolean", default: true })
  verified_channel: boolean;

  @ApiProperty({
    enum: Statuses,
    default: Statuses.approved,
  })
  status: string;
}

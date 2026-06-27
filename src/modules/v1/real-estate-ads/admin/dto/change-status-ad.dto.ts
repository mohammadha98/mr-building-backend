import { ApiProperty } from "@nestjs/swagger";
import Statuses from "src/commons/contracts/Statuses";
import statuses from "src/commons/contracts/Statuses";

export class Admin_ChangeStatusAdDto {
  user_id: number;

  @ApiProperty()
  item_id: number;

  @ApiProperty({ enum: Statuses, default: statuses.approved })
  status: string;

  @ApiProperty({ required: false, example: "fair, high, low" })
  price_status: string;

  @ApiProperty({ isArray: true, type: "string" })
  reasons: string[];
}

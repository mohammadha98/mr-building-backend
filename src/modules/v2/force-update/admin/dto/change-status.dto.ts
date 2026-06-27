import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";
import statuses from "src/commons/contracts/Statuses";

export class ChangeStatusDto {
  user_id: number;

  @ApiProperty({ enum: statuses, type: "string", default: statuses.active })
  status: string;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  item_id: number;
}

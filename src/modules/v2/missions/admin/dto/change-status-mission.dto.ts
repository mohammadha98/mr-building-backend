import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import statuses from "src/commons/contracts/Statuses";

export class ChangeStatusMissionDto {
  user_id: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty({ enum: statuses, default: statuses.active })
  @IsString()
  @IsNotEmpty()
  status: string;
}

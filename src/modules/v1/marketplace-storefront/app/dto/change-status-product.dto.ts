import { ApiProperty } from "@nestjs/swagger";
import Statuses from "src/commons/contracts/Statuses";
import { IsEnum } from "class-validator";

export class ChangeStatusProductDto {
  client_id: number;

  @ApiProperty()
  product_id: string;

  @ApiProperty({ enum: Statuses, default: Statuses.active })
  @IsEnum(Statuses)
  status: string;
}

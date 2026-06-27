import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class UsePrizeDto {
  client_id: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  item_id: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class UsePrizeDto {
  client_id: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  item_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coupon: string;
}

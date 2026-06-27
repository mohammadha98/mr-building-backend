import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class RealEstateAgentChangeStatusDto {
  user_id: number;

  @ApiProperty({ default: 1 })
  @IsNumberString()
  item_id: string;

  @ApiProperty({ example: "approved, rejected" })
  @IsString()
  status: string;
}

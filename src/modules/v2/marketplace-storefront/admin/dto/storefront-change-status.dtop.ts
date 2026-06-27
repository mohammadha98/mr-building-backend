import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RealEstateAgentChangeStatusDto {
  user_id: number;

  @ApiProperty()
  item_id: string;

  @ApiProperty({ example: "approved, rejected" })
  @IsString()
  status: string;
}

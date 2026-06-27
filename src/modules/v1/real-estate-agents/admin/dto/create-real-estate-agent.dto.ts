import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateRealEstateAgentDto {
  user_id: number;
  estate_agent_id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ name: "avatar", type: "string", format: "binary" })
  avatar: string;

  @ApiProperty({ name: "license", type: "string", format: "binary" })
  license: string;

  @ApiProperty()
  @IsNumberString()
  province_id: number;

  @ApiProperty()
  @IsNumberString()
  city_id: number;
}

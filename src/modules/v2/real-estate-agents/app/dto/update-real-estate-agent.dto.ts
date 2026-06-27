import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateRealEstateAgentDto } from "./create-real-estate-agent.dto";
import { IsNumberString, IsString } from "class-validator";

export class UpdateRealEstateAgentDto extends PartialType(
  CreateRealEstateAgentDto
) {
  @ApiProperty()
  @IsNumberString()
  estate_agent_id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    name: "avatar",
    type: "string",
    format: "binary",
    required: true,
  })
  avatar: string;

  @ApiProperty({
    name: "license",
    type: "string",
    format: "binary",
    required: true,
  })
  license: string;

  @ApiProperty()
  @IsNumberString()
  province_id: number;

  @ApiProperty()
  @IsNumberString()
  city_id: number;
}

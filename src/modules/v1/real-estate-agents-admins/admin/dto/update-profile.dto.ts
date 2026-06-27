import { ApiProperty } from "@nestjs/swagger";

export class UpdateAdvisorProfileDto {
  client_id: number;

  @ApiProperty({ type: "integer" })
  advisor_id: number;

  @ApiProperty({ type: "string" })
  bio: string;
}

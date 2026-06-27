import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString } from "class-validator";

export class UpdateAdminPermissionsDto {
  client_id: string;

  @ApiProperty()
  @IsNumber()
  agent_id: number;

  @ApiProperty()
  @IsNumber()
  admin_id: number;

  @ApiProperty({ isArray: true, type: "string" })
  permissions: string[];
}

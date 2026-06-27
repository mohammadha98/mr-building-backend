import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNumberString, IsString } from "class-validator";

export class CreateRealEstateAgentsAdvisorDto {
  client_id: string;

  @ApiProperty()
  @IsNumberString()
  agent_id: number;

  @ApiProperty()
  @IsString({ message: "فرمت شماره موبایل صحیح نمیباشد." })
  @IsMobilePhone()
  phone: string;

  @ApiProperty({ isArray: true, type: "string" })
  permissions: string[];
}
export class UpdatePermissionsForAdvisorDto {
  @ApiProperty()
  advisor_id: number;

  @ApiProperty({ isArray: true, type: "string" })
  permissions: string[];
}

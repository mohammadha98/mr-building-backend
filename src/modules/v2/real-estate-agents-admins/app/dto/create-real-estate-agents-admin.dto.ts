import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNumber, IsString } from "class-validator";

export class CreateRealEstateAgentsAdminDto {
  client_id: string;

  @ApiProperty()
  @IsNumber()
  agent_id: number;

  @ApiProperty()
  @IsString({ message: "فرمت شماره موبایل صحیح نمیباشد." })
  @IsMobilePhone()
  phone: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ isArray: true, type: "string" })
  permissions: string[];
}

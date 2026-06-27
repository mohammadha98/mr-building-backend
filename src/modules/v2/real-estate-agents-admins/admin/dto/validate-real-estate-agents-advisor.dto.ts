import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString } from "class-validator";

export class ValidateRealEstateAgentsAdvisorDto {
  client_id: string;

  @ApiProperty()
  @IsString({ message: "فرمت شماره موبایل صحیح نمیباشد." })
  @IsMobilePhone()
  phone: string;
}

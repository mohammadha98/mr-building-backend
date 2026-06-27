import { ApiProperty } from "@nestjs/swagger";
import UserTypes from "src/commons/contracts/UserTypes";

export class VerifyCodeValidateClientDto {
  client_id: number;

  @ApiProperty({ enum: UserTypes, default: UserTypes.estate_agent })
  type: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  code: number;
}

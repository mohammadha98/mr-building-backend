import { ApiProperty } from "@nestjs/swagger";
import UserTypes from "src/commons/contracts/UserTypes";

export class CreateValidateClientDto {
  client_id: number;
  code: number;

  @ApiProperty({ enum: UserTypes, default: UserTypes.estate_agent })
  type: string;

  @ApiProperty()
  phone: string;
}

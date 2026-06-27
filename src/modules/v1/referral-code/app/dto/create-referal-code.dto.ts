import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateReferralCodeDto {
  client_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

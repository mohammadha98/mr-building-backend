import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class InvitedClientsIntoWebinarDto {
  @ApiProperty()
  @IsNumberString()
  webinar_id: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class InvitedClientsIntoEventGroupDto {
  @ApiProperty()
  @IsNumberString()
  group_id: number;
}

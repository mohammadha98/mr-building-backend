import { ApiProperty } from "@nestjs/swagger";

export class Contact {
  @ApiProperty()
  client_id: number;

  @ApiProperty()
  userid: number;

  @ApiProperty()
  display_name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({
    example: "teacher, assistant, participant",
  })
  role: string;
}

export class InviteContactDto {
  user_id: number;

  @ApiProperty({
    type: Contact,
    isArray: true,
  })
  contacts: Contact[];
  @ApiProperty()
  room_id: number;
}

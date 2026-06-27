import { ApiProperty } from "@nestjs/swagger";

export class GetGroupMembersDto {
  client_id: number;

  @ApiProperty()
  group_id: number;
}

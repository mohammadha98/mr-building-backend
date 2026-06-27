import { ApiProperty } from "@nestjs/swagger";

export class GetGroupsMessagesDto {
  client_id: number;

  @ApiProperty()
  group_id: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;
}

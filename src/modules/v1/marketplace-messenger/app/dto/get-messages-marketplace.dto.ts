import { ApiProperty } from "@nestjs/swagger";

export class GetMessagesMarketplaceDto {
  client_id: number;

  @ApiProperty()
  key: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;
}

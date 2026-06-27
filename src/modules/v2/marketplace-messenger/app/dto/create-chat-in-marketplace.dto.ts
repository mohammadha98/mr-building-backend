import { ApiProperty } from "@nestjs/swagger";

export class CreateChatInMarketplaceDto {
  @ApiProperty()
  item_id: string;
}

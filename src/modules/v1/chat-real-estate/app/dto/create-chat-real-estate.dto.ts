import { ApiProperty } from "@nestjs/swagger";
import ChatRealEstateTypes from "src/commons/contracts/ChatRealEstateTypes";

export class CreateChatRealEstateDto {
  client_id: number;

  @ApiProperty({
    enum: ChatRealEstateTypes,
    default: ChatRealEstateTypes.advertisement,
  })
  type: string;

  @ApiProperty()
  item_id: number;
}

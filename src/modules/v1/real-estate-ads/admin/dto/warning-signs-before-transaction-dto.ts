import { ApiProperty } from "@nestjs/swagger";

export class WarningSignsBeforeTransactionDto {
  @ApiProperty()
  item_id: string;

  @ApiProperty()
  content: string;
}

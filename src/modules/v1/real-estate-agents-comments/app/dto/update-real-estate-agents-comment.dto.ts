import { ApiProperty } from "@nestjs/swagger";

export class DeleteCommentDto {
  @ApiProperty()
  item_id: number;
  @ApiProperty()
  comment_id: number;
}

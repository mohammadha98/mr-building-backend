import { ApiProperty } from "@nestjs/swagger";

export class SaveCommentInServicesDto {
  user_id: number;

  @ApiProperty()
  service_id: string;

  @ApiProperty({ required: false })
  reply_to_id: string;

  @ApiProperty()
  content: string;
}

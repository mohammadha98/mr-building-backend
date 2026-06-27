import { ApiProperty } from "@nestjs/swagger";

export class GetCommentsDto {
  user_id: number;

  @ApiProperty()
  service_id: string;

  @ApiProperty({ default: 1 })
  page: number;

  @ApiProperty({ default: 12 })
  per_page: number;
}

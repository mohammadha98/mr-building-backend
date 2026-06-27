import { ApiProperty } from "@nestjs/swagger";

export class CreateMyCityBookmarkDto {
  @ApiProperty({ type: String })
  location_id: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class GetUsersReferralCodeDto {
  client_id: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;
}

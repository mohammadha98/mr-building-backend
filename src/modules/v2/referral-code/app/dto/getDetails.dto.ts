import { ApiProperty } from "@nestjs/swagger";

export class getDetailsReferralCodeDto {
  client_id: number;

  @ApiProperty()
  referra_id: number;
}

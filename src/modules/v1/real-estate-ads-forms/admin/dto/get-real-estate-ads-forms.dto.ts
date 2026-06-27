import { ApiProperty } from "@nestjs/swagger";

export class GetRealEstateAdFormsItemsDto {
  client_id: number;

  @ApiProperty()
  form_id: string;
}

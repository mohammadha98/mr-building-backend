import { ApiProperty } from "@nestjs/swagger";

export class GetProductFeaturesDto {
  client_id: number;

  @ApiProperty()
  form_id: string;
}

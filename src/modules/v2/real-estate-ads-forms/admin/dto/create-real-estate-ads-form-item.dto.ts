import { ApiProperty } from "@nestjs/swagger";
import FeatureFieldTypes from "src/commons/contracts/FeatureFieldTypes";

export class CreateRealEstateAdFormsItemsDto {
  user_id: number;

  @ApiProperty()
  form_id: string;

  @ApiProperty()
  field_name: string;

  @ApiProperty({ enum: FeatureFieldTypes, title: "field_type" })
  field_type: string;

  @ApiProperty({ title: "values", type: "string", isArray: true })
  values: string[];

  @ApiProperty({ name: "icon", type: "string", format: "binary" })
  icon: string;
}

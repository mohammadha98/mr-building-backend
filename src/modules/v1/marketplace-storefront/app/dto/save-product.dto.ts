import { ApiProperty } from "@nestjs/swagger";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";

class AdItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;
}

class AdMedia {
  @ApiProperty()
  id: number;

  @ApiProperty()
  file_name: string;

  @ApiProperty({
    default: `${RealEstateAdMediaType.image}, ${RealEstateAdMediaType.video}`,
    title: "media_type",
  })
  file_type: string;

  @ApiProperty()
  sort_number: number;

  @ApiProperty({
    default: `${RealEstateAdMediaTypePriorities.primary}, ${RealEstateAdMediaTypePriorities.normal}`,
    title: "priority",
  })
  priority: string;
}

export class SaveProductDto {
  client_id: number;
  tracking_code: string;
  storefront_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  unit_of_sales: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ default: false })
  has_discount: boolean;

  @ApiProperty({ default: 0 })
  discounted_price: number;

  @ApiProperty({ isArray: true })
  colors: string[];

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  sub_category_id: string;

  @ApiProperty()
  brand_id: string;

  @ApiProperty({ type: AdItem, isArray: true })
  items: AdItem[];

  @ApiProperty({ type: AdMedia, isArray: true })
  media: AdMedia[];
}

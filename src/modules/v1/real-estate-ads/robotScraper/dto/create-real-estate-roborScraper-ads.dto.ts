import { ApiProperty } from "@nestjs/swagger";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";

class AdItemScraper {
  @ApiProperty()
  field_name: string;

  @ApiProperty()
  value: string;
}

class AdMediaScraper {
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

export class CreateRealEstateAdRobotScraperDto {
  client_id: number;
  tracking_code: string;

  @ApiProperty({
    default: RealEstateAdSellerTypes.individual,
  })
  seller_type: string;

  @ApiProperty({ default: "divar" })
  tag: string;

  @ApiProperty()
  owner_name: string;

  @ApiProperty()
  owner_phone: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  sub_category: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ default: false })
  is_applicant: boolean;

  @ApiProperty()
  year_built: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  sale_price: number;

  @ApiProperty()
  deposit_price: number;

  @ApiProperty()
  rent_price: number;

  @ApiProperty()
  number_of_rooms: number;

  @ApiProperty()
  max_capicity: number;

  @ApiProperty()
  normal_days_price: number;

  @ApiProperty()
  weekend_price: number;

  @ApiProperty()
  special_days_price: number;

  @ApiProperty()
  cost_per_additional_person: number;

  @ApiProperty()
  extra_people: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  province: number;

  @ApiProperty()
  city: number;

  @ApiProperty()
  area: string;

  @ApiProperty({ type: AdItemScraper, isArray: true })
  items: AdItemScraper[];

  @ApiProperty({ type: AdMediaScraper, isArray: true })
  media: AdMediaScraper[];
}

export class DownloadFileUrl {
  @ApiProperty()
  url: string;

  @ApiProperty()
  dest: string;
}

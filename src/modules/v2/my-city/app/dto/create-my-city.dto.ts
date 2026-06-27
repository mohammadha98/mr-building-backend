import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";
import { MyCityFilesEnum } from "../enums/myCity.files.enum";
import { RealEstateMediaItemTypes } from "../../../real-estate-ads/app/dto/delete-media-item.dto";

class MyCityFile {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({
    enum: MyCityFilesEnum,
    default: MyCityFilesEnum.file,
  })
  tag: MyCityFilesEnum;

  @ApiProperty({
    enum: RealEstateMediaItemTypes,
    default: RealEstateMediaItemTypes.temp,
  })
  type: string;

  @ApiProperty({ required: false })
  file_name: string;

  @ApiProperty({ nullable: true, required: false })
  thumbnail: string;

  @ApiProperty({
    default: `image, video, file`,
    title: "media_type",
    required: false,
  })
  file_type: string;

  @ApiProperty({ required: false })
  sort_number: number;

  @ApiProperty({
    default: `primary, normal`,
    title: "priority",
    required: false,
  })
  priority: string;
}

export class UploadFileMyCityDto extends MyCityFile {
  @ApiProperty({ name: "file", type: "string", format: "binary" })
  file: string;
}

export class CreateMyCityDto {
  @ApiProperty({
    enum: MyCityCategoriesEnum,
    default: `${MyCityCategoriesEnum.constructionProjects}, ${MyCityCategoriesEnum.offices}, ${MyCityCategoriesEnum.stores}, ${MyCityCategoriesEnum.stores}`,
  })
  category: MyCityCategoriesEnum;

  @ApiProperty({ type: String })
  title: string;

  @IsOptional()
  @ApiProperty({ type: String })
  description: string;

  @IsOptional()
  @ApiProperty({ type: Number })
  year_built: number;

  @IsOptional()
  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Number })
  number_of_rooms: number;

  @IsOptional()
  @ApiProperty({ default: false })
  renovation_tax: boolean;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Number })
  province_id: number;

  @ApiProperty({ type: Number })
  city_id: number;

  @ApiProperty({ isArray: true, type: MyCityFile })
  files: MyCityFile[];
}

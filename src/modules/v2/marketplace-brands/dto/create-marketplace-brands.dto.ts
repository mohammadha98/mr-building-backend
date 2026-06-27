import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateMarketplaceBrandsDto {
  user_id: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  item_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  second_title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  @ApiProperty({
    name: "thumbnail",
    type: "string",
    format: "binary",
    required: false,
  })
  thumbnail: string;
}

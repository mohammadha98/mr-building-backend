import { ApiProperty } from "@nestjs/swagger";

export class SliderSchema {
  @ApiProperty({ example: "عنوام اسلایدر" })
  title: string;
  @ApiProperty({ type: "String", examples: ["active", "inactive"] })
  status: string;
}

import { ApiProperty } from "@nestjs/swagger";
import InstalledVersionTypes from "src/commons/contracts/InstalledVersionTypes";

export class GetHomePageDto {
  client_id: number;

  @ApiProperty({
    enum: InstalledVersionTypes,
    default: InstalledVersionTypes.direct,
    required: false,
  })
  installed_version_type: string;
}

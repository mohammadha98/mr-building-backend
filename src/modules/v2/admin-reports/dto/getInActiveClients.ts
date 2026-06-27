import { ApiProperty } from "@nestjs/swagger";

class InactiveFromType {
  @ApiProperty({ default: "1", example: "1" })
  date: string;
  @ApiProperty({ default: "8", example: "8" })
  month: string;
  @ApiProperty({ default: "2024", example: "2024" })
  year: string;
}

export class GetInActiveClients {
  @ApiProperty()
  from: InactiveFromType;
  @ApiProperty()
  to: InactiveFromType;
}

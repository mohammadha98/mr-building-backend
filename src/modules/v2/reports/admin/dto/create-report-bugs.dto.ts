import { ApiProperty } from "@nestjs/swagger";

export class CreateReportBugDto {
  client_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    name: "image",
    type: "string",
    format: "binary",
    required: false,
  })
  image: string;

  @ApiProperty({
    name: "voice",
    type: "string",
    format: "binary",
    required: false,
  })
  voice: string;
}

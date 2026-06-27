import { ApiProperty } from "@nestjs/swagger";

export default class InternalServerErrorSchema {
  @ApiProperty({
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    example: "خطای سرور. لطفا کمی بعد تلاش کنید",
  })
  message: string;

  @ApiProperty({
    example: "",
  })
  error: string;

  @ApiProperty({
    example: {},
  })
  data: object;
}

import { ApiProperty } from "@nestjs/swagger";

export default class NotFoundSchema {
  @ApiProperty({
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    example: "خطا. آدرس موردنظر یافت نشد",
  })
  message: string;

  @ApiProperty({
    example: "Not Found",
  })
  error: string;

  @ApiProperty({
    example: {},
  })
  data: object;
}

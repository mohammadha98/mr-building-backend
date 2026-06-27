import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalServerErrorHandler extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "خطا. سرور قادر به پردازش درخواست شما نمیباشد.",
        error: "INTERNAL_SERVER_ERROR",
        data: {},
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

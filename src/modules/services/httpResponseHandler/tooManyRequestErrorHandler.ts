import { HttpException, HttpStatus } from "@nestjs/common";

export class tooManyRequestErrorHandler extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message:
          "خطا. تعداد درخواست غیر مجاز. لطفا کمی صبر کنید و مجدد تلاش کنید.",
        error: "TOO_MANY_REQUESTS",
        data: {},
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}

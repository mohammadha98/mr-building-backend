import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestErrorHandler extends HttpException {
  constructor(message: any) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: "Bad Request",
        data: {},
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

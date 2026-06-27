import { HttpException, HttpStatus } from "@nestjs/common";

export class UnProcessableEntity extends HttpException {
  constructor(message: any) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message,
        error: "UnProcessable Entity",
        data: {},
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

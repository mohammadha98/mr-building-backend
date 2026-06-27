import { Injectable, Res } from "@nestjs/common";

@Injectable()
export class HttpResponsehandler {
  public send(
    res: any,
    statusCode: number,
    message?: string,
    data: any = null
  ) {
    res.status(statusCode);

    return res.send({
      statusCode,
      message: message,
      error: "",
      data: data ? data : {},
    });
  }
}

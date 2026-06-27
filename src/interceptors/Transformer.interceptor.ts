import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { ITransformerInterceptorData } from "./ITransformerInterceptorData";

@Injectable()
export class TransformerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    try {
      // before
      // const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      console.log("---- Transformer Interceptor ----");
      console.log("before");

      //after
      return next.handle().pipe(
        map((data: ITransformerInterceptorData) => {
          console.log("after");
          if (data.statusCode) {
            console.log("statusCode: ", data.statusCode);
            response.status(data.statusCode);

            return response.send({
              statusCode: data.statusCode,
              message: data.message,
              data: data.data ? data.data : {},
            });
          }
        })
      );
    } catch (error) {
      console.log("ERROR in Transformer Interceptor");
      console.log({ error });
    }
  }
}

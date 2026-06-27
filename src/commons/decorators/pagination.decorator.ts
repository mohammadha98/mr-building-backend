import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import * as process from "process";

export function Pagination() {
  return applyDecorators(
    ApiQuery({ name: "page", type: "integer" }),
    ApiQuery({ name: "per_page", type: "integer" })
  );
}

import {
  Controller,
  Get,
  Res,
  Request,
  Response,
  UseGuards,
  Query,
  Param,
} from "@nestjs/common";
import { WebinarService } from "./webinar.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import WebinarTransformer from "./Transformer";
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from "@nestjs/swagger";

import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import UnProcessableEntitySchema from "src/commons/contracts/swaggerDefinations/UnProcessableEntitySchema";
import NotFoundSchema from "src/commons/contracts/swaggerDefinations/NotFoundSchema";
import ForbiddenSchema from "src/commons/contracts/swaggerDefinations/ForbiddenSchema";
import UnAuthorizedSchema from "src/commons/contracts/swaggerDefinations/UnAuthorizedSchema";
import EventService from "../provider/EventService";
import { CreateWebinarDto } from "./dto/create-webinar.dto";
import { FormDataRequest } from "nestjs-form-data";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
import { SaveProceedingDto } from "./dto/SaveProceedingDto";
import { DeleteWebinarDto } from "./dto/delete-webinar.dto.ts";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { UpdateWebinarDto } from "./dto/update-webinar.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import { ClientWebinarsDto } from "./dto/ClientWebinarsDto";
import { InvitedClientsIntoWebinarDto } from "./dto/InvitedClientsIntoWebinarDto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-webinar")
@Controller("v1/admin/webinars")
export class WebinarController {
  private responsehandler: HttpResponsehandler;
  private webinarTransformer: WebinarTransformer;
  constructor(private readonly weninarService: WebinarService) {
    this.responsehandler = new HttpResponsehandler();
    this.webinarTransformer = new WebinarTransformer();
  }

  // دریافت وبینار ها
  @ApiOperation({
    summary: "دریافت وبینار ها",
    description: "دریافت وبینار های ثبت شده",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست وبینارها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست وبینارها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                },
              },
            },
            metadata: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                total_page: { type: "integer", example: 1 },
                per_page: { type: "integer", example: 1 },
                next: { type: "boolean", example: true },
                back: { type: "boolean", example: false },
              },
            },
          },
        },
      },
    },
  })
  // Unauthorized Response
  @ApiUnauthorizedResponse({
    description: "خطا. احزار هویت انجام نشده است",
    type: UnAuthorizedSchema,
    schema: {
      $ref: getSchemaPath(UnAuthorizedSchema),
    },
  })
  // Forbidden Response
  @ApiForbiddenResponse({
    description: "خطا. اجازه ادامه کار را ندارید.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(ForbiddenSchema),
    },
  })
  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @ApiQuery({ type: PaginationDto })
  @Get("/list")
  async finWebinars(
    @Query() query: any,
    @Request() req: any,
    @Res() res: Response
  ) {
    query.user_id = req.user.id;
    const result = await this.weninarService.findAllWebinars(query);
    const webinarTransformer = this.webinarTransformer.collection(
      result.webinars
    );
    return this.responsehandler.send(res, 200, "لیست وبینارها در دسترس است.", {
      data: webinarTransformer,
      metadata: result.metadata,
    });
  }

  // لیست کاربران دعوت شده به وبینار در دسترس است.
  @ApiOperation({
    summary: " لیست کاربران دعوت شده به وبینار",
    description: "دریافت لیست کاربران دعوت شده به وبینار",
  })
  @ApiConsumes("multipart/form-data")

  // ok response
  @ApiOkResponse({
    description: "لیست کاربران دعوت شده به وبینار در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کاربران دعوت شده به وبینار در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              client_id: { type: "integer", example: 12 },
              userid: { type: "integer", example: 12 },
              display_name: {
                type: "strint",
                example: "پوریا میرخباز",
              },
              phone: { type: "string", example: "09183372684" },
              role: { type: "string", example: "teacher" },
            },
          },
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    type: BadRequestSchema,
    description:
      "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
    },
  })
  // Unauthorized Response
  @ApiUnauthorizedResponse({
    description: "خطا. احزار هویت انجام نشده است",
    type: UnAuthorizedSchema,
    schema: {
      $ref: getSchemaPath(UnAuthorizedSchema),
    },
  })
  // Forbidden Response
  @ApiForbiddenResponse({
    description: "خطا. اجازه ادامه کار را ندارید.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(ForbiddenSchema),
    },
  })
  // UnprocessableEntity Response
  @ApiNotFoundResponse({
    description: "خطا. آدرس موردنظر یافت نشد",
    type: NotFoundSchema,
    schema: {
      $ref: getSchemaPath(NotFoundSchema),
    },
  })
  // UnprocessableEntity Response
  @ApiUnprocessableEntityResponse({
    description:
      "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
    type: UnProcessableEntitySchema,
    schema: {
      $ref: getSchemaPath(UnProcessableEntitySchema),
    },
  })
  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  // @Get("/users")
  async findInvitedWebinars(
    @Query() query: InvitedClientsIntoWebinarDto,
    @Res() res: Response
  ) {
    const data = await this.weninarService.findInvitedWebinars(
      query.webinar_id
    );

    const webinarTransformer = this.webinarTransformer.guestCollection(data);
    return this.responsehandler.send(
      res,
      200,
      "لیست کاربران دعوت شده به وبینار در دسترس است.",
      webinarTransformer
    );
  }

  // حذف وبینار
  @ApiOkResponse({
    description: "وبینار موردنظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وبینار موردنظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  // Unauthorized Response
  @ApiUnauthorizedResponse({
    description: "خطا. احزار هویت انجام نشده است",
    type: UnAuthorizedSchema,
    schema: {
      $ref: getSchemaPath(UnAuthorizedSchema),
    },
  })
  // Forbidden Response
  @ApiForbiddenResponse({
    description: "خطا. اجازه ادامه کار را ندارید.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(ForbiddenSchema),
    },
  })
  // NotFound Response
  @ApiNotFoundResponse({
    description: "خطا. آدرس موردنظر یافت نشد",
    type: NotFoundSchema,
    schema: {
      $ref: getSchemaPath(NotFoundSchema),
    },
  })
  // UnprocessableEntity Response
  @ApiUnprocessableEntityResponse({
    description:
      "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
    type: UnProcessableEntitySchema,
    schema: {
      $ref: getSchemaPath(UnProcessableEntitySchema),
    },
  })
  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @ApiOperation({ summary: "حذف وبینار" })
  // @Delete(":webinar_id")
  async deleteWebinar(
    @Param() deleteWebinarDto: DeleteWebinarDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    deleteWebinarDto.user_id = req.user.id;
    const result = await this.weninarService.deleteWebinar(deleteWebinarDto);

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    return this.responsehandler.send(
      res,
      200,
      "وبینار موردنظر با موفقیت حذف شد."
    );
  }
}

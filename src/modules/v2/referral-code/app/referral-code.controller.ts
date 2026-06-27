import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { ReferralCodeService } from "./referral-code.service";
import { CreateReferralCodeDto } from "./dto/create-referal-code.dto";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v2/jwt-auth/jwt-auth.guard";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ReferralCodeTransformer from "./transformer";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { FormDataRequest } from "nestjs-form-data";
import { GetUsersReferralCodeDto } from "./dto/get-users-referal-code.dto";
import { getDetailsReferralCodeDto } from "./dto/getDetails.dto";
import { ConflictErrorHandler } from "src/modules/services/httpResponseHandler/conflictErrorHandler";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-referral-code")
@Controller("v2/app/referral-code")
export class ReferralCodeController {
  constructor(
    private readonly referralCodeService: ReferralCodeService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly referalCodeTransformer: ReferralCodeTransformer
  ) {}

  @ApiOkResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "بررسی و ثبت کدمعرف" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post()
  async create(
    @Body() body: CreateReferralCodeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    const result = await this.referralCodeService.create(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کد معرف اشتباه است.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 409) {
      throw new ConflictErrorHandler(
        "خطا. کد معرف خود را نمیتوانید استفاده کنید."
      );
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, result.status, result.message);
  }

  @ApiOkResponse({
    description: "لیست کاربران در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کاربران در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              client_id: { type: "integer" },
              client_name: { type: "string" },
              client_phone: { type: "string" },
              client_roles: {
                type: "array",
                example: [
                  "client",
                  "estate_agent",
                  "advisor",
                  "admin",
                  "operator_estate_agent",
                ],
              },
              referral_id: { type: "integer" },
              referral_code: { type: "string" },
              number_of_sub_categories: { type: "integer" },
              point: { type: "integer" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست  کاربرانی که از کد معرف استفاده کرده اند" })
  @Get("users")
  async getMyUser(
    @Query() query: GetUsersReferralCodeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("get User in Referral Code");
    console.log(query);
    const result = await this.referralCodeService.getMyUser(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.referalCodeTransformer.userCollection(
      result.clients,
      result.score
    );

    return this.responseHandler.send(
      res,
      200,
      "لیست کاربران در دسترس است.",
      transformer
    );
  }

  @ApiOkResponse({
    description: "جزییات فرد دعوت شده در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "جزییات فرد دعوت شده در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              total: {
                type: "object",
                properties: {
                  client: { type: "integer" },
                  estate_agent: { type: "integer" },
                  advisor: { type: "integer" },
                  admin: { type: "integer" },
                  operator_estate_agent: { type: "integer" },
                },
              },
              point: { type: "integer" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "جزییات دعوت شده" })
  @Get("users/details")
  async getReferralDetails(
    @Query() query: getDetailsReferralCodeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("*** getReferralDetails ***");
    console.log(query);
    const result = await this.referralCodeService.getReferralDetails(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.referalCodeTransformer.transform({
      total: result.total,
      point: result.point,
    });
    return this.responseHandler.send(
      res,
      200,
      "جزییات فرد دعوت شده در دسترس است.",
      transformer
    );
  }

  // TODO: Remove this after update CLient ReferralCode
  @Get("/update_codes")
  async updateCodes(@Request() req: any, @Response() res: Response) {
    console.log("*** Update ReferralCodes ***");
    const result = await this.referralCodeService.updateCodes();

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کد معرف اشتباه است.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
  }
}

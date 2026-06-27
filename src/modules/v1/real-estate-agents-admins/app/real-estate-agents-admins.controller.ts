import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { RealEstateAgentsAdminsService } from "./real-estate-agents-admins.service";
import { CreateRealEstateAgentsAdminDto } from "./dto/create-real-estate-agents-admin.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FormDataRequest } from "nestjs-form-data";
import ClientTransformer from "src/modules/v1/client/app/Transformer";
import { GetRealEstateAgentsAdminsDto } from "./dto/get-real-estate-agents-admins.dto";
import RealEstateAdminTransformer from "./Transformer";
import { ChangeStatusRealEstateAdminsAdminsDto } from "./dto/change-status-real-estate-agents-admins.dto";
import { DeleteRealEstateAgentsAdminsDto } from "./dto/delete-real-estate-agents-admin.dto";
import { UpdateAdminPermissionsDto } from "./dto/update-admin-permisions";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/real-estate-agents-admins")
@Controller("v1/app/real-estate-agents-admins")
export class RealEstateAgentsAdminsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly realEstateAdminTransformer: RealEstateAdminTransformer,
    private readonly clientTransformer: ClientTransformer,
    private readonly realEstateAgentsAdminsService: RealEstateAgentsAdminsService
  ) {}

  // بررسی شماره ادمین
  @ApiOkResponse({
    description: "ریسپانس در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "ریسپانس در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "estate_agent, not_found, busy, free",
            },
            client_info: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                provider_id: { type: "integer", example: 1 },
                name: { type: "string", example: "" },
                surname: { type: "string", example: "" },
                phone: { type: "string", example: "09120000000" },
                avatar: { type: "string", example: "" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "بررسی شماره ادمین" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/validate")
  async validate(
    @Body() body: ValidateRealEstateAgentsAdvisorDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    // TODO: log RealEstateAgentsAdmin: validate
    console.log("*** RealEstateAgentsAdmin: validate ***");
    console.log(body);

    const result = await this.realEstateAgentsAdminsService.validate(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.clientTransformer.transform(result.user);

    return this.responseHandler.send(res, 200, "ریسپانس در دسترس است.", {
      status: result.result,
      client_info: transformer,
    });
  }

  // افزودن ادمین به مشاور املاک
  // ok response
  @ApiOkResponse({
    description: "افزودن ادمین انجام نشد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "افزودن ادمین انجام نشد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "admin, estate_agent, not_found, busy",
            },
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: "ادمین با موفقیت اضافه شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "ادمین با موفقیت اضافه شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            status: { type: "string", example: "created" },
            result: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string" },
                phone: { type: "string" },
                color: { type: "string" },
                agent_id: { type: "integer", example: 1 },
                agent_name: { type: "string" },
                agent_number_of_ads: { type: "integer", example: 1 },
                agent_score: { type: "integer", example: 1 },
                agent_avatar: { type: "string" },
                province: { type: "string" },
                permissions: { type: "array", items: {} },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "افزودن ادمین به مشاوراملاک" })
  @Post()
  async create(
    @Body() body: CreateRealEstateAgentsAdminDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    // TODO: log RealEstateAgentsAdmin: create
    console.log("*** RealEstateAgentsAdmin: create ***");
    console.log(body);

    const result = await this.realEstateAgentsAdminsService.create(body);
    if (result.status === 200) {
      const transformer = this.clientTransformer.transform(result.admin);

      return this.responseHandler.send(
        res,
        200,
        "ادمین موردنظر اضافه نشد. برای بررسی دلیل خطا به جزییات ریسپانس مراجعه کنید.",
        {
          status: result.result,
          client_info: transformer,
        }
      );
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    return this.responseHandler.send(res, 201, "ادمین با موفقیت اضافه شد.", {
      status: result.result,
      result: result.transform,
    });
  }

  // دریافت لیست ادمین های یک مشاور املاک
  @ApiOkResponse({
    description: "لیست ادمین های ادمین در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست ادمین های ادمین در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string" },
              phone: { type: "string" },
              color: { type: "string" },
              agent_id: { type: "integer", example: 1 },
              agent_name: { type: "string" },
              agent_number_of_ads: { type: "integer", example: 1 },
              agent_score: { type: "integer", example: 1 },
              agent_avatar: { type: "string" },
              province: { type: "string" },
              permissions: { type: "array", items: {} },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت لیست ادمین های یک مشاور املاک" })
  @Get()
  async findAll(
    @Query() query: GetRealEstateAgentsAdminsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdmin: findAll ***");
    console.log({ query });

    const result = await this.realEstateAgentsAdminsService.findAll(query);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. مشاور املاک موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "لیست ادمین های ادمین در دسترس است.",
      result.admins
    );
  }

  // تغییر وضعیت ادمین
  @ApiOkResponse({
    description: "وضعیت ادمین با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وضعیت ادمین با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "تغییر وضعیت ادمین" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  // @Patch()
  async changeStatus(
    @Body() body: ChangeStatusRealEstateAdminsAdminsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** RealEstateAgentsAdmin: change status ***");
    console.log(body);
    body.client_id = req.user.id;

    const result = await this.realEstateAgentsAdminsService.changeStatus(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا . ادمین مورد نظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "وضعیت ادمین با موفقیت تغییر کرد."
    );
  }

  // تغییر دسترسی ادمین
  @ApiOkResponse({
    description: "وضعیت ادمین با موفقیت تغییر کرد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "وضعیت ادمین با موفقیت تغییر کرد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "ویرایش دسترسی" })
  @Patch("permissions")
  async updatePermissions(
    @Body() body: UpdateAdminPermissionsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** RealEstateAgentsAdmin: Update Permissions ***");
    console.log(body);
    body.client_id = req.user.id;

    const result = await this.realEstateAgentsAdminsService.updatePermissions(
      body
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا . ادمین مورد نظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "وضعیت ادمین با موفقیت تغییر کرد."
    );
  }

  // حذف ادمین
  @ApiOkResponse({
    description: "ادمین  با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "ادمین  با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف ادمین" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Delete()
  async removeAdmin(
    @Body() body: DeleteRealEstateAgentsAdminsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    console.log("*** RealEstateAgentsAdmin: removeAdmin ***");
    console.log(body);

    const result = await this.realEstateAgentsAdminsService.removeAdmin(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا . ادمین مورد نظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 200, "ادمین  با موفقیت حذف شد.");
  }
}

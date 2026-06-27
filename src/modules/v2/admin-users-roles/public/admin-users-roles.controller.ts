import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { AdminUsersRolesService } from "./admin-users-roles.service";
import { ApiSecurity, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";

import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import AdminTokenAuthGuard from "src/modules/v2//jwt-auth/AdminTokenAuthGuard";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import adminUserRolesTransformer from "./Transformer";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { CreateRoleDto } from "../private/dto/create-role";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-users-roles")
@Controller("v2/admin/users/roles")
export class AdminUsersRolesController {
  private readonly responseHandler: HttpResponsehandler;

  constructor(
    private readonly adminUsersRolesService: AdminUsersRolesService,
    private readonly transformer: adminUserRolesTransformer
  ) {
    this.responseHandler = new HttpResponsehandler();
  }

  @Get("/categories")
  @ApiOperation({ summary: "دریافت دسته بندی ها و پرمیشن هایشان" })
  @FormDataRequest()
  async getCategoryRoles(@Request() request: any, @Response() res: Response) {
    console.log("getCategoryRoles: ADMIN");

    const result: any = await this.adminUsersRolesService.getCategoryRoles();

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.transformer.collectionCategoryRoles(
      result.categoryInfo
    );
    return this.responseHandler.send(
      res,
      200,
      "لیست دسته بندی ها در دسترس است.",
      transformer
    );
  }

  @Post()
  @ApiOperation({ summary: "ایجاد - ویرایش رول" })
  @FormDataRequest()
  async createCategoryRoles(
    @Body() body: CreateRoleDto,
    @Request() request: any,
    @Response() res: Response
  ) {
    body.creator_id = request.user.id;
    console.log("create/update  role for admin user");
    console.log({ body });

    const result: any = await this.adminUsersRolesService.createRole(body);

    //
    // if (result.status === 400) {
    //   throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    // } else if (result.status === 500) {
    //   throw new InternalServerErrorSchema();
    // }
    // const transformer = this.transformer.transformCategoryRoles(result.result);
    return this.responseHandler.send(
      res,
      201,
      "رول جدید با موفقیت ایجاد شد."
      // transformer
    );
  }

  // دریافت دسته بندی ها و پرمیشن هایشان
  @Get("")
  @ApiOperation({ summary: "لیست رول ها" })
  async roleList(@Query() query: PaginationDto, @Response() res: Response) {
    console.log("roleList: ADMIN");
    console.log({ query });

    const result: any = await this.adminUsersRolesService.roleList(
      query as any
    );

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.transformer.collectionRoles(result.roles);
    return this.responseHandler.send(res, 200, "لیست رول ها در دسترس است.", {
      data: transformer,
      metadata: result.metadata,
    });
  }

  // دریافت دسته بندی ها و پرمیشن هایشان
  @Get(":role_id")
  @ApiOperation({ summary: "جزییات رول" })
  async roleInfo(
    @Param("role_id") role_id: string,
    @Request() request: any,
    @Response() res: Response
  ) {
    console.log("roleInfo: ADMIN");
    console.log({ role_id });

    const result: any = await this.adminUsersRolesService.roleInfo(role_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    // const transformer = this.transformer.collectionRoles(result.info);
    return this.responseHandler.send(
      res,
      200,
      "جزییات رول در دسترس است.",
      result.info
    );
  }

  // حذف رول
  @Delete("/:role_id")
  @ApiOperation({ summary: "حذف رول" })
  @FormDataRequest()
  async deleteRole(
    @Param("role_id") role_id: string,
    @Request() request: any,
    @Response() res: Response
  ) {
    console.log("deleteRole: ADMIN");
    console.log({ role_id });
    const result: any = await this.adminUsersRolesService.deleteRole(role_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    return this.responseHandler.send(res, 200, "حذف با موفقیت انجام شد");
  }
}

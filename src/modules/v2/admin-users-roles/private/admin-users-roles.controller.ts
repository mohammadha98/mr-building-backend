import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
} from "@nestjs/common";
import { AdminUsersRolesService } from "./admin-users-roles.service";
import {
  ApiCreatedResponse,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import AdminTokenAuthGuard from "src/modules/v2//jwt-auth/AdminTokenAuthGuard";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { CreateCategoryRolePermissionsDto } from "src/modules/v2//admin-users-roles/private/dto/create-category-role-permissions";
import { CreateCategoryRolesDto } from "src/modules/v2//admin-users-roles/private/dto/create-category-roles";
import { UpdateCategoryRolesDto } from "src/modules/v2//admin-users-roles/private/dto/update-category-roles";
import { UpdatePermissionCategoryRoleDto } from "src/modules/v2//admin-users-roles/private/dto/update-category-roles-permission";
import adminUserRolesTransformer from "./Transformer";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-users-roles-categories")
@Controller("v2/admin/users/roles/private/categories")
export class AdminUsersRolesController {
  private readonly responseHandler: HttpResponsehandler;

  constructor(
    private readonly adminUsersRolesService: AdminUsersRolesService,
    private readonly transformer: adminUserRolesTransformer
  ) {
    this.responseHandler = new HttpResponsehandler();
  }

  // ***** roles ****
  // ایجاد دسته بندی رول ها
  @ApiCreatedResponse({
    description: "دسته بندی جدید با موفقیت ایجاد شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 201 },
        message: {
          type: "string",
          example: "دسته بندی جدید با موفقیت ایجاد شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
          },
        },
      },
    },
  })
  @Post()
  @ApiOperation({ summary: "ایجاد - ویرایش دسته بندی رول ها" })
  @FormDataRequest()
  async createCategoryRoles(
    @Body() body: CreateCategoryRolesDto,
    @Request() request: any,
    @Response() res: Response
  ) {
    body.creator_id = request.user.id;
    console.log("create/update category roles for admin user");
    console.log({ body });

    const result: any = await this.adminUsersRolesService.createCategoryRoles(
      body
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.transformer.transformCategoryRoles(result.result);
    return this.responseHandler.send(
      res,
      201,
      "دسته بندی جدید با موفقیت ایجاد شد.",
      transformer
    );
  }

  // دریافت دسته بندی رول ها
  @ApiOkResponse({
    description: "لیست دسته بندی ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "لیست دسته بندی ها در دسترس است.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
            permissions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  key: { type: "string" },
                  category_id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get()
  @ApiOperation({ summary: "دریافت دسته بندی رول ها" })
  @FormDataRequest()
  async getCategoryRoles(@Request() request: any, @Response() res: Response) {
    console.log("getCategoryRoles: Private API");
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

  // حذف دسته بندی رول ها
  @ApiOkResponse({
    description: "حذف با موفقیت انجام شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "حذف با موفقیت انجام شد",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
            permissions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  key: { type: "string" },
                  category_id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @Delete("/:category_id")
  @ApiOperation({ summary: "حذف دسته بندی رول ها" })
  @FormDataRequest()
  async deleteCategoryRoles(
    @Param("category_id") category_id: string,
    @Request() request: any,
    @Response() res: Response
  ) {
    const result: any = await this.adminUsersRolesService.deleteCategoryRoles(
      category_id
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    return this.responseHandler.send(res, 200, "حذف با موفقیت انجام شد");
  }

  // ویرایش دسته بندی رول ها
  @ApiOkResponse({
    description: "دسته بندی جدید مورد نظر ویرایش شد..",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "دسته بندی جدید مورد نظر ویرایش شد..",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
          },
        },
      },
    },
  })
  @Patch()
  @ApiOperation({ summary: "ویرایش دسته بندی رول ها" })
  @FormDataRequest()
  async updateCategoryRoles(
    @Body() body: UpdateCategoryRolesDto,
    @Request() request: any,
    @Response() res: Response
  ) {
    body.creator_id = request.user.id;
    console.log("Update category roles for admin user");
    console.log({ body });

    const result: any =
      await this.adminUsersRolesService.UpdateCategoryRolesDto(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.transformer.transformCategoryRoles(result.result);
    return this.responseHandler.send(
      res,
      200,
      "دسته بندی جدید مورد نظر ویرایش شد..",
      transformer
    );
  }

  // ایجاد پرمیشن برای دسته بندی رول ها
  @ApiCreatedResponse({
    description: "پرمیشن جدید برای دسته بندی موردنظر با موفقیت ایجاد شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 201 },
        message: {
          type: "string",
          example: "پرمیشن جدید برای دسته بندی موردنظر با موفقیت ایجاد شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
          },
        },
      },
    },
  })
  @Post("permissions")
  @ApiOperation({ summary: "ایجاد پرمیشن برای دسته بندی رول ها" })
  @FormDataRequest()
  async CreateCategoryRolePermissions(
    @Body() body: CreateCategoryRolePermissionsDto,
    @Request() request: any,
    @Response() res: Response
  ) {
    body.creator_id = request.user.id;
    console.log("create Permissions for category roles for admin user");
    console.log({ body });

    const result: any =
      await this.adminUsersRolesService.CreateCategoryRolePermissions(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.transformer.transformPermissionCategoryRoles(
      result.result
    );
    return this.responseHandler.send(
      res,
      201,
      "پرمیشن جدید برای دسته بندی موردنظر با موفقیت ایجاد شد.",
      transformer
    );
  }

  // ویرایش پرمیشن برای دسته بندی رول ها
  @ApiOkResponse({
    description: "ویرایش پرمیشن برای دسته بندی رول ها انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "ویرایش پرمیشن برای دسته بندی رول ها انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
          },
        },
      },
    },
  })
  @Patch("permissions")
  @ApiOperation({ summary: "ویرایش پرمیشن دسته بندی" })
  @FormDataRequest()
  async UpdatePermissionCategoryRole(
    @Body() body: UpdatePermissionCategoryRoleDto,
    @Request() request: any,
    @Response() res: Response
  ) {
    body.creator_id = request.user.id;
    console.log("Update Permission for category roles for admin user");
    console.log({ body });

    const result: any =
      await this.adminUsersRolesService.UpdatePermissionCategoryRoleDto(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    const transformer = this.transformer.transformPermissionCategoryRoles(
      result.result
    );
    return this.responseHandler.send(
      res,
      200,
      "ویرایش پرمیشن برای دسته بندی رول ها انجام شد.",
      transformer
    );
  }

  // حذف دسته بندی رول ها
  @ApiOkResponse({
    description: "حذف با موفقیت انجام شد",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "حذف با موفقیت انجام شد",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            key: { type: "string" },
            permissions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  key: { type: "string" },
                  category_id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @Delete("/:permission_id")
  @ApiOperation({ summary: "حذف پرمیشن دسته بندی " })
  @FormDataRequest()
  async deleteCategoryPermission(
    @Param("permission_id") permission_id: string,
    @Request() request: any,
    @Response() res: Response
  ) {
    const result: any =
      await this.adminUsersRolesService.deleteCategoryPermission(permission_id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    return this.responseHandler.send(res, 200, "حذف با موفقیت انجام شد");
  }
}

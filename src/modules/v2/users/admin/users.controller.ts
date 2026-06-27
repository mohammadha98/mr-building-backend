import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Request,
  Response,
  UseGuards,
  Query,
  Patch,
  Delete,
  Param,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiOkResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiSecurity,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  getSchemaPath,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { LoginUserDto } from "./dto/login-user.dto";
import UserTransformer from "./Transformer";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import ForbiddenSchema from "src/commons/contracts/swaggerDefinations/ForbiddenSchema";
import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import UnAuthorizedSchema from "src/commons/contracts/swaggerDefinations/UnAuthorizedSchema";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { UserChangePasswordDto } from "./dto/user-change-password.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto copy";
import AdminTokenAuthGuard from "src/modules/v2/jwt-auth/AdminTokenAuthGuard";
import { ConflictErrorHandler } from "src/modules/services/httpResponseHandler/conflictErrorHandler";
import { UpdateUserRolesDto } from "./dto/update-user-roles.dto";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";

@ApiTags("v2/dashboard-users")
@Controller("v2/admin/users")
export class UsersController {
  private readonly responseHandler: HttpResponsehandler;

  constructor(
    private readonly usersService: UsersService,
    private readonly userTransformer: UserTransformer
  ) {
    this.responseHandler = new HttpResponsehandler();
  }

  // ایجاد کاربر
  // ok response
  @ApiCreatedResponse({
    description: "کاربر جدید با موفقیت ایجاد شد.",
  })
  @ApiConflictResponse({
    description: "خطا. ایمیل ارسالی تکراری میباشد.",
  })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Post("register")
  @ApiOperation({ summary: "ایجاد کاربر" })
  @ApiBody({ type: CreateUserDto })
  @FormDataRequest()
  async create(
    @Body() body: CreateUserDto,
    @Request() request: any,
    @Response() res: Response
  ) {
    body.creator_id = request.user.id;
    console.log("create admin user");
    console.log({ body });
    console.log(request.user);

    const result = await this.usersService.create(body);
    if (result.status === 409) {
      throw new ConflictErrorHandler("خطا. ایمیل ارسالی تکراری میباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    return this.responseHandler.send(
      res,
      201,
      "کاربر جدید با موفقیت ایجاد شد."
    );
  }

  //   دریافت اطلاعات کاربر پنل
  // ok response
  @ApiOkResponse({
    description: "مشخصات کاربر موردنظر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "مشخصات کاربر موردنظر در دسترس است.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 201 },
            message: {
              type: "string",
              example: "کاربر جدید با موفقیت ایجاد شد.",
            },
            error: { type: "string", example: "" },
            data: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
                uniq_key: { type: "string" },
                phone: { type: "string" },
                avatar: { type: "string" },
                token: { type: "string" },
                refresh_token: { type: "string" },
                status: { type: "string", example: "active, inactive" },
                created_at: { type: "string" },
                roles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      key: { type: "string" },
                      categories: {
                        type: "array",
                        items: {
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
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
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
  @ApiOperation({ summary: "دریافت اطلاعات کاربر پنل" })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Get("/info/:user_key")
  async userInfo(
    @Param("user_key") user_key: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    const body = {
      user_key,
      token_id: req.user.id,
    };

    const result = await this.usersService.getUserInfo(body);

    if (result.status === 403) {
      throw new BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }

    const transformer = this.userTransformer.transform(result.user);
    return this.responseHandler.send(
      res,
      200,
      "مشخصات کاربر موردنظر در دسترس است.",
      transformer
    );
  }

  // لاگین
  // ok response
  @ApiOkResponse({
    description: "با موفقیت وارد شدید.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: { type: "string", example: "با موفقیت وارد شدید." },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            statusCode: { type: "number", example: 201 },
            message: {
              type: "string",
              example: "کاربر جدید با موفقیت ایجاد شد.",
            },
            error: { type: "string", example: "" },
            data: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
                uniq_key: { type: "string" },
                phone: { type: "string" },
                avatar: { type: "string" },
                token: { type: "string" },
                refresh_token: { type: "string" },
                status: { type: "string", example: "active, inactive" },
                roles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      key: { type: "string" },
                      categories: {
                        type: "array",
                        items: {
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
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    type: BadRequestSchema,
    description: "خطا. ایمیل یا کلمه عبور صحیح نمیباشد.",
  })
  @ApiOperation({ summary: "لاگین کاربر به داشبورد" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiBody({ type: LoginUserDto })
  @Post("/login")
  async login(
    @Body() registerAuthDto: LoginUserDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    const result = await this.usersService.login(
      registerAuthDto.email,
      registerAuthDto.password
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. ایمیل یا کلمه عبور اشتباه است.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.userTransformer.transform(result.user);

    return this.responseHandler.send(
      res,
      HttpStatus.OK,
      "با موفقیت وارد شدید.",
      transformer
    );
  }

  // auth user token
  // ok response
  @ApiOkResponse({
    description: "اعتبار سنجی با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: { type: "string", example: "اعتبار سنجی با موفقیت انجام شد." },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
            uniq_key: { type: "string" },
            phone: { type: "string" },
            avatar: { type: "string" },
            token: { type: "string" },
            refresh_token: { type: "string" },
            status: { type: "string", example: "active, inactive" },
            created_at: { type: "string" },
            roles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  key: { type: "string" },
                  categories: {
                    type: "array",
                    items: {
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
                            },
                          },
                        },
                      },
                    },
                  },
                },
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
  @ApiOperation({ summary: "اعتبار سنجی توکن " })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Post("/auth")
  async tokenValidaion(@Request() req: any, @Response() res: Response) {
    const user_id = req.user.id;
    const result = await this.usersService.tokenValidaion(user_id);

    if (result.status === 403) {
      throw new ForbiddenSchema();
    }
    const transformer = this.userTransformer.transform(result.user);
    return this.responseHandler.send(
      res,
      200,
      "اعتبار سنجی با موفقیت انجام شد.",
      transformer
    );
  }

  // get dashboard users
  // ok response
  @ApiOkResponse({
    description: "لیست کاربران پنل در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: { type: "string", example: "لیست کاربران پنل در دسترس است." },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  email: { type: "string" },
                  uniq_key: { type: "string" },
                  phone: { type: "string" },
                  avatar: { type: "string" },
                  token: { type: "string" },
                  refresh_token: { type: "string" },
                  status: { type: "string", example: "active, inactive" },
                  created_at: { type: "string" },
                  roles: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        key: { type: "string" },
                        categories: {
                          type: "array",
                          items: {
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
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
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
  @ApiOperation({ summary: "لیست کاربران پنل" })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    paginationQuery.user_id = req.user.id;
    const result = await this.usersService.findAll(paginationQuery);
    if (result.status === 403) {
      throw new ForbiddenSchema();
    }
    const userTransformer = this.userTransformer.collection(result.users);

    return this.responseHandler.send(
      res,
      200,
      "لیست کاربران پنل در دسترس است.",
      {
        data: userTransformer,
        metadata: result.metadata,
      }
    );
  }

  // ویرایش کاربر پنل
  // ok response
  @ApiOkResponse({
    description: "ویرایش با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "ویرایش با موفقیت انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
            uniq_key: { type: "string" },
            phone: { type: "string" },
            avatar: { type: "string" },
            token: { type: "string" },
            refresh_token: { type: "string" },
            status: { type: "string", example: "active || inactive" },
          },
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
    },
  })
  @ApiConflictResponse({
    description: "خطا. ایمیل وارد شده تکراری میباشد.",
  })
  // Forbidden Response
  @ApiForbiddenResponse({
    description: "خطا. اجازه ادامه کار را ندارید.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(ForbiddenSchema),
    },
  })
  @ApiOperation({ summary: "ویرایش کاربران پنل" })
  @ApiBody({ type: UpdateUserDto })
  @FormDataRequest()
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    updateUserDto.user_id = req.user.id;
    const result = await this.usersService.updateUser(updateUserDto);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
    } else if (result.status === 409) {
      throw new ConflictErrorHandler("خطا. ایمیل وارد شده تکراری میباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد");
  }

  // ویرایش کاربر پنل
  // ok response
  @ApiOkResponse({
    description: "بروزرسانی با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "ویرایش با موفقیت انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
            uniq_key: { type: "string" },
            phone: { type: "string" },
            avatar: { type: "string" },
            token: { type: "string" },
            refresh_token: { type: "string" },
            status: { type: "string", example: "active || inactive" },
          },
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "بروزرسانی با موفقیت انجام شد.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
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
  @ApiOperation({ summary: "بروزرسانی نقش ها" })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Patch("roles")
  async updateUserRoles(
    @Body() updateUserDto: UpdateUserRolesDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    updateUserDto.user_id = req.user.id;
    const result = await this.usersService.updateRoles(updateUserDto);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
    } else if (result.status === 409) {
      throw new ConflictErrorHandler("خطا. ایمیل وارد شده تکراری میباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد.");
  }

  // حذف کاربر
  @ApiOkResponse({
    description: "عملیات حذف با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "عملیات حذف با موفقیت انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
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
  @ApiOperation({ summary: "حذف کاربر" })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @Delete(":user_id")
  async removeUser(
    @Param("user_id") user_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    const result = await this.usersService.removeUser(user_id);

    if (result.status === 403) {
      throw new BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    return this.responseHandler.send(
      res,
      200,
      "عملیات حذف با موفقیت انجام شد."
    );
  }

  // تغییر پسورد
  @ApiOkResponse({
    description: "پسورد کاربر با موفقیت بروزرسانی شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "پسورد کاربر با موفقیت بروزرسانی شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
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
  @ApiOperation({ summary: "تغییر پسورد" })
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  @FormDataRequest()
  @ApiConsumes("multipart/form-data")
  @Post("/change_password")
  async changePassword(
    @Body() changePasswordDto: UserChangePasswordDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    changePasswordDto.token_id = req.user.id;
    const result = await this.usersService.changePassword(changePasswordDto);

    if (result.status === 403) {
      throw new BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    return this.responseHandler.send(
      res,
      200,
      "پسورد کاربر با موفقیت بروزرسانی شد."
    );
  }

  // ویرایش پروفایل توسط کاربر
  // ok response
  @ApiOkResponse({
    description: "ویرایش با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 200 },
        message: {
          type: "string",
          example: "ویرایش با موفقیت انجام شد.",
        },
        error: { type: "string", example: "" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  // BadRequest Response
  @ApiBadRequestResponse({
    description: "خطا. آیتم موردنظر موجود نمیباشد.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(BadRequestSchema),
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
  @ApiOperation({ summary: "ویرایش پروفایل توسط کاربر پنل" })
  @ApiBody({ type: UpdateUserProfileDto })
  @FormDataRequest()
  @UseGuards(AdminTokenAuthGuard)
  @ApiSecurity("JWT-auth")
  // @Post("update_profile")
  async updateProfile(
    @Body() updateUserDto: UpdateUserProfileDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    updateUserDto.user_id = req.user.id;
    const result = await this.usersService.updateUserProfile(updateUserDto);

    if (result.status === 403) {
      throw new BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorSchema();
    }
    return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد");
  }
}

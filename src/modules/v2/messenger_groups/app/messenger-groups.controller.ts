import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Response,
  Query,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { MessengerGroupsService } from "./messenger-groups.service";
import { CreateGroupDto } from "./dto/create-group.dto";

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v2/jwt-auth/jwt-auth.guard";
import { FormDataRequest } from "nestjs-form-data";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import MessageTransformer from "./Transformer";
import { GetGroupsMessagesDto } from "./dto/get-messages.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { join, parse } from "path";
import { UpdateGroupTypeDto } from "./dto/update-group-type.dto";
import { GetGroupMembersDto } from "./dto/getMembers";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-messenger-groups")
@Controller("v2/app/messenger-groups")
export class MessengerGroupsController {
  constructor(
    private readonly messengerGroupsService: MessengerGroupsService,
    private readonly messengerGroupsTransformer: MessageTransformer,
    private readonly responsehandler: HttpResponsehandler
  ) {}

  // ایجاد گروه
  @ApiCreatedResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            owner_id: { type: "integer" },
            is_owner: { type: "boolean" },
            key: { type: "string" },
            title: { type: "string" },
            member_count: { type: "integer" },
            description: { type: "string" },
            avatar: { type: "string" },
            type: { type: "string" },
            link: { type: "string" },
            number_of_unread_messages: { type: "integer" },
            last_message: {
              type: "object",
              properties: {
                id: { type: "integer" },
                Group_id: { type: "integer" },
                key: { type: "string" },
                type: { type: "string" },
                content: { type: "string" },
                size: { type: "integer", example: 4763476 },
                length: { type: "integer", example: 295.523265 },
                thumbnail: { type: "string" },
                created_at: {
                  type: "object",
                  properties: {
                    day: { type: "integer" },
                    month: { type: "string" },
                    year: { type: "integer" },
                    time: { type: "string" },
                  },
                },
              },
            },
            last_message_time: {
              type: "object",
              properties: {
                day: { type: "integer" },
                month: { type: "string" },
                year: { type: "integer" },
                time: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: " ایجاد گروه" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./public/contents/temp/files",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(4).toString("hex").toUpperCase();
          const extention = parse(join(file.originalname)).ext;
          callback(null, `${Date.now()}-${uniqueCode}${extention}`);
        },
      }),
    }),
    CheckFileMiddleware
  )
  @ApiBody({ type: CreateGroupDto })
  @Post()
  async createGroup(
    @Body() body: CreateGroupDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    body.client_id = req.user.id;
    body.avatar = avatar ? avatar.filename : null;

    console.log("*** Create Messenger Group ***");
    console.log(body);

    const result = await this.messengerGroupsService.createGroup(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.messengerGroupsTransformer.transform(
      result.result,
      req.user.id
    );

    return this.responsehandler.send(
      res,
      201,
      "عملیات با موفقیت انجام شد.",
      transformer
    );
  }

  @ApiCreatedResponse({
    description: "عملیات با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "عملیات با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            link: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ایجاد یوزرنیم جدید" })
  @ApiConsumes("multipart/form-data")
  @Post("username/:group_id")
  async generateUsernameForGroup(
    @Param("group_id") group_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** generate Username For Channel ***");
    console.log({ group_id });

    const result = await this.messengerGroupsService.generateUsernameForGroup(
      group_id
    );
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 201, "عملیات با موفقیت انجام شد.", {
      link: result.username,
    });
  }

  // تغییر تایپ
  @ApiOkResponse({
    description: "تغییر تایپ گروه انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "تغییر تایپ گروه انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "تغییر تایپ " })
  @FormDataRequest()
  @Patch("type")
  async updateGroupType(
    @Body() body: UpdateGroupTypeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** Update Group Type: APP ***");
    console.log(body);

    const result = await this.messengerGroupsService.UpdateGroupTypeDto(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا . گروه موردنظر  موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 200, "تغییر تایپ گروه انجام شد.");
  }

  // بررسی لینک گروه عمومی
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
          properties: {
            status: { type: "boolean", default: false },
          },
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "بررسی لینک گروه عمومی" })
  @FormDataRequest()
  @Post("public/validate")
  async validateGroupLink(
    @Body() body: UpdateGroupTypeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** Vlidate Group Link: APP ***");
    console.log(body);

    const result = await this.messengerGroupsService.validateGroupLink(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.", {
      status: result.validateStatus,
    });
  }

  // دریافت لیست گروه های کاربر
  @ApiOkResponse({
    description: "لیست گروه های شما در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گروه های شما در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            groups: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  owner_id: { type: "integer" },
                  is_owner: { type: "boolean" },
                  key: { type: "string" },
                  title: { type: "string" },
                  member_count: { type: "integer" },
                  description: { type: "string" },
                  avatar: { type: "string" },
                  type: { type: "string" },
                  link: { type: "string" },
                  number_of_unread_messages: { type: "integer" },
                  last_message: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        Group_id: { type: "integer" },
                        key: { type: "string" },
                        type: { type: "string" },
                        content: { type: "string" },
                        size: { type: "integer", example: 4763476 },
                        length: { type: "integer", example: 295.523265 },
                        thumbnail: { type: "string" },
                        created_at: {
                          type: "object",
                          properties: {
                            day: { type: "integer" },
                            month: { type: "string" },
                            year: { type: "integer" },
                            time: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                  last_message_time: {
                    type: "object",
                    properties: {
                      day: { type: "integer" },
                      month: { type: "string" },
                      year: { type: "integer" },
                      time: { type: "string" },
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
  @ApiOperation({ summary: "لیست گروه های من" })
  @Get()
  async GroupsList(@Request() req: any, @Response() res: Response) {
    console.log("*** List Messenger Group ***");
    console.log({ client_id: req.user.id });

    const result = await this.messengerGroupsService.getMyGroups({
      client_id: req.user.id,
    });

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const groups = this.messengerGroupsTransformer.collection(
      result.groups,
      req.user.id
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست گروه های شما در دسترس است.",
      {
        groups,
      }
    );
  }

  // لیست پیام ها
  @ApiOkResponse({
    description: "لیست پیام ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست پیام ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            membership_status: { type: "boolean", example: false },
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer" },
                  group_id: { type: "integer" },
                  key: { type: "string" },
                  type: { type: "string" },
                  content: { type: "string" },
                  size: { type: "integer", example: 4763476 },
                  length: { type: "integer", example: 295.523265 },
                  thumbnail: { type: "string" },
                  client_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      avatar: { type: "string" },
                      phone: { type: "string" },
                      key: { type: "string" },
                    },
                  },
                  created_at: {
                    type: "object",
                    properties: {
                      day: { type: "integer" },
                      month: { type: "string" },
                      year: { type: "integer" },
                      time: { type: "string" },
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
  @ApiOperation({ summary: "دریافت پیام ها" })
  @Get("messages")
  async getMessages(
    @Query() query: GetGroupsMessagesDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** Get Group Messages ***");
    console.log({ query });
    const result = await this.messengerGroupsService.getMessages(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.messengerGroupsTransformer.messageCollection(
      result.messages
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست پیام ها در دسترس است.",
      {
        membership_status: result.membership_status,
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  // لیست ممبر ها
  @ApiOkResponse({
    description: "لیست ممبر ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست ممبر ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            properties: {
              role: { type: "string", example: "owner, member, admin" },
              client_id: { type: "integer" },
              user_key: { type: "string" },
              name: { type: "string" },
              avatar: { type: "string" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت ممبر ها" })
  @Get("members")
  async getMembers(
    @Query() query: GetGroupMembersDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** Get Group Messenger: Members ***");
    console.log({ query });
    const result = await this.messengerGroupsService.getMembers(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.messengerGroupsTransformer.memberCollection(
      result.members
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست ممبر ها در دسترس است.",
      transformer
    );
  }

  // دریافت اطلاعات گروه (مشخصات گروه - 12 پیام آخر گروه)
  @ApiOkResponse({
    description: "لیست گروه های شما در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گروه های شما در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            has_joined: { type: "boolean", default: false },
            group_info: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                owner_id: { type: "integer" },
                is_owner: { type: "boolean" },
                key: { type: "string" },
                title: { type: "string" },
                member_count: { type: "integer" },
                description: { type: "string" },
                avatar: { type: "string" },
                type: { type: "string" },
                link: { type: "string" },
                number_of_unread_messages: { type: "integer" },
                last_message: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      Group_id: { type: "integer" },
                      key: { type: "string" },
                      type: { type: "string" },
                      content: { type: "string" },
                      size: { type: "integer", example: 4763476 },
                      length: { type: "integer", example: 295.523265 },
                      thumbnail: { type: "string" },
                      created_at: {
                        type: "object",
                        properties: {
                          day: { type: "integer" },
                          month: { type: "string" },
                          year: { type: "integer" },
                          time: { type: "string" },
                        },
                      },
                    },
                  },
                },
                last_message_time: {
                  type: "object",
                  properties: {
                    day: { type: "integer" },
                    month: { type: "string" },
                    year: { type: "integer" },
                    time: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiOperation({ summary: "دریافت اطلاعات گروه" })
  @Get("/info/:username")
  async groupInfo(
    @Param("username") username: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** Group Info: Messenger ***");
    const body = { client_id: req.user.id, username };
    console.log(body);

    const result = await this.messengerGroupsService.groupInfo(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const groups = this.messengerGroupsTransformer.collection(
      result.groups,
      req.user.id
    );

    return this.responsehandler.send(
      res,
      result.status,
      "مشخصات گروه در دسترس است",
      {
        has_joined: result.has_joined,
        group_info: groups[0],
      }
    );
  }
}

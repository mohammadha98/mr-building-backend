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
import { MessengerChannelsService } from "./messenger-channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";

import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import { FormDataRequest } from "nestjs-form-data";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import MessageTransformer from "./Transformer";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { join, parse } from "path";
import { UpdateChannelTypeDto } from "./dto/update-channel-type-channel.dto";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";
import { RequestVerifyChannelDto } from "./dto/request-verify-channel.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-messenger-channel")
@Controller("v1/app/messenger-channel")
export class MessengerChannelsController {
  constructor(
    private readonly messengerChannelService: MessengerChannelsService,
    private readonly messengerChannelTransformer: MessageTransformer,
    private readonly responsehandler: HttpResponsehandler
  ) {}

  // ایجاد کانال
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
            verified_channel: { type: "boolean" },
            is_owner: { type: "boolean" },
            key: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            avatar: { type: "string" },
            type: { type: "string" },
            link: { type: "string" },
            number_of_unread_messages: { type: "integer" },
            last_message: {
              type: "object",
              properties: {
                id: { type: "integer" },
                channel_id: { type: "integer" },
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
  @ApiOperation({ summary: " ایجاد کانال" })
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
  @ApiBody({ type: CreateChannelDto })
  @Post()
  async createChannel(
    @Body() body: CreateChannelDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    body.client_id = req.user.id;
    body.avatar = avatar ? avatar.filename : null;

    console.log("*** Create Messenger Channel ***");
    console.log(body);

    const result = await this.messengerChannelService.createChannel(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.messengerChannelTransformer.transform(
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

  // ایجاد کانال
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
  @Post("username/:channel_id")
  async generateUsernameForChannel(
    @Param("channel_id") channel_id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** generate Username For Channel ***");
    console.log({ channel_id });

    const result =
      await this.messengerChannelService.generateUsernameForChannel(channel_id);
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
    description: "تغییر تایپ کانال انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "تغییر تایپ کانال انجام شد.",
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
  async updateChannelType(
    @Body() body: UpdateChannelTypeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** Update Channel Type: APP ***");
    console.log(body);

    const result = await this.messengerChannelService.UpdateChannelTypeDto(
      body
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا . کانال موردنظر  موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 200, "تغییر تایپ کانال انجام شد.");
  }

  // تغییر تایپ
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
  @ApiOperation({ summary: "بررسی لینک کانال عمومی" })
  @FormDataRequest()
  @Post("public/validate")
  async validateChannelLink(
    @Body() body: UpdateChannelTypeDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** ٰalidate Channel Link: APP ***");
    console.log(body);

    const result = await this.messengerChannelService.validateChannelLink(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.", {
      status: result.validateStatus,
    });
  }

  // دریافت لیست کانال های کاربر
  @ApiOkResponse({
    description: "لیست کانال های شما در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کانال های شما در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            channels: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  owner_id: { type: "integer" },
                  is_owner: { type: "boolean" },
                  key: { type: "string" },
                  requested: { type: "boolean" },
                  verified_channel: { type: "boolean" },
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
                        channel_id: { type: "integer" },
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
  @ApiOperation({ summary: "لیست کانال های من" })
  @Get()
  async channelsList(@Request() req: any, @Response() res: Response) {
    console.log("*** List Messenger Channels ***");
    console.log({ client_id: req.user.id });

    const result = await this.messengerChannelService.getMyChannels({
      client_id: req.user.id,
    });

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.messengerChannelTransformer.collection(
      result.channels,
      req.user.id
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست کانال های شما در دسترس است.",
      {
        channels,
      }
    );
  }

  // دریافت لیست کانال های کاربر
  @ApiOkResponse({
    description: "لیست کانال های شما در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کانال های شما در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            channels: {
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
                        channel_id: { type: "integer" },
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
  @ApiOperation({ summary: "لیست کانال های رسمی" })
  @Get("/verified")
  async getChannelVerified(@Request() req: any, @Response() res: Response) {
    console.log("*** List Messenger Verified Channels ***");
    console.log({ client_id: req.user.id });

    const result = await this.messengerChannelService.getChannelVerified({
      client_id: req.user.id,
    });

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.messengerChannelTransformer.collection(
      result.channels,
      req.user.id
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست کانال های شما در دسترس است.",
      {
        channels,
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
                  channel_id: { type: "integer" },
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
    @Query() query: GetChannelsMessagesDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** Get Channel Messages ***");
    console.log({ query });
    const result = await this.messengerChannelService.getMessages(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.messengerChannelTransformer.messageCollection(
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
    @Query() query: GetChannelsMembersDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** Get Channel Messenger: Members ***");
    console.log({ query });
    const result = await this.messengerChannelService.getMembers(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.messengerChannelTransformer.memberCollection(
      result.members
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست ممبر ها در دسترس است.",
      transformer
    );
  }

  // دریافت لیست کانال های کاربر
  @ApiOkResponse({
    description: "لیست کانال های شما در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کانال های شما در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            is_joined: { type: "boolean", example: false },
            channel_info: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  owner_id: { type: "integer" },
                  requested: { type: "boolean" },
                  verified_channel: { type: "boolean" },
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
                        channel_id: { type: "integer" },
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
  @ApiOperation({ summary: "مشخصات کانال" })
  @Get("/info/:username")
  async channelInfo(
    @Param("username") username: string,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** ChannelInfo: App ***");
    console.log({ client_id: req.user.id });
    console.log({ username });

    const body = {
      client_id: req.user.id,
      username,
    };
    const result = await this.messengerChannelService.channelInfo(body);
    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.messengerChannelTransformer.collection(
      result.channels,
      req.user.id
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست کانال های شما در دسترس است.",
      {
        is_joined: result.is_joined,
        channel_info: channels[0],
      }
    );
  }

  @ApiCreatedResponse({
    description: "درخواست شما ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "درخواست شما ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "درخواست رسمی شدن کانال" })
  @Post("/request/official")
  async requestToOfficialChannel(
    @Body() body: RequestVerifyChannelDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    console.log("*** requestToOfficialChannel: App ***");
    console.log(body);

    const result = await this.messengerChannelService.requestToOfficialChannel(
      body
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 201, "درخواست شما ثبت شد.");
  }
}

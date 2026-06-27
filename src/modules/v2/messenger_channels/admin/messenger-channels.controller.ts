import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Response,
  Query,
  Post,
  Body,
} from "@nestjs/common";
import { MessengerChannelsService } from "./messenger-channels.service";

import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import MessageTransformer from "./Transformer";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { ChangeStatusRequestVerifyDto } from "./dto/changeStatus-request-verify.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-messenger-channel")
@Controller("v2/admin/messenger/channel")
export class MessengerChannelsController {
  constructor(
    private readonly messengerChannelService: MessengerChannelsService,
    private readonly messengerChannelTransformer: MessageTransformer,
    private readonly responsehandler: HttpResponsehandler
  ) {}

  // لیست کانال ها
  @ApiOkResponse({
    description: "لیست کانال ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کانال ها در دسترس است.",
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
                  key: { type: "string" },
                  title: { type: "string" },
                  requested: { type: "boolean" },
                  verified_channel: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      verified_channel: { type: "boolean" },
                      description: { type: "string" },
                      status: {
                        type: "string",
                        example: "pending, approved, rejected",
                      },
                    },
                  },
                  member_count: { type: "integer" },
                  description: { type: "string" },
                  avatar: { type: "string" },
                  type: { type: "string" },
                  username: { type: "string" },
                  last_message_time: {
                    type: "object",
                    properties: {
                      day: { type: "integer" },
                      month: { type: "string" },
                      year: { type: "integer" },
                      time: { type: "string" },
                    },
                  },
                  message_time: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست کانال ها" })
  @Get()
  async channelsList(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** List Messenger Channels: ADMIN ***");
    query.user_id = req.user.id;
    console.log(query);

    const result = await this.messengerChannelService.getChannels(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.messengerChannelTransformer.collection(
      result.channels
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست کانال ها در دسترس است.",
      {
        channels,
        metadata: result.metadata,
      }
    );
  }

  // لیست کانال های رسمی
  @ApiOkResponse({
    description: "لیست درخواست ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست درخواست ها در دسترس است.",
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
                  verified_channel: { type: "boolean", default: false },
                  description: { type: "string" },
                  status: {
                    type: "string",
                    example: "pending, approved, rejected",
                  },
                  created_at: { type: "string" },
                  updatedAt: { type: "string" },
                  channel: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      owner_id: { type: "integer" },
                      key: { type: "string" },
                      title: { type: "string" },
                      requested: { type: "boolean" },
                      verified_channel: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          verified_channel: { type: "boolean" },
                          description: { type: "string" },
                          status: {
                            type: "string",
                            example: "pending, approved, rejected",
                          },
                        },
                      },
                      member_count: { type: "integer" },
                      description: { type: "string" },
                      avatar: { type: "string" },
                      type: { type: "string" },
                      username: { type: "string" },
                      last_message_time: {
                        type: "object",
                        properties: {
                          day: { type: "integer" },
                          month: { type: "string" },
                          year: { type: "integer" },
                          time: { type: "string" },
                        },
                      },
                      message_time: { type: "string" },
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
  @Get("/official")
  async getChannelVerified(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** List Messenger Verified Channels ***");
    query.user_id = req.user.id;
    console.log({ query });

    const result = await this.messengerChannelService.channelOfficials(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.messengerChannelTransformer.collectionOfficialChannel(
      result.channels
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست درخواست ها در دسترس است.",
      {
        channels,
        metadata: result.metadata,
      }
    );
  }

  //تغییر وضعیت درخواست ها
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
  @ApiOperation({ summary: "تغییر وضعیت درخواست ها" })
  @Post("/official/change_status")
  async changeStatusRequests(
    @Body() body: ChangeStatusRequestVerifyDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** changeStatusRequests Verified Channels ***");
    body.user_id = req.user.id;
    console.log({ body });

    const result = await this.messengerChannelService.changeStatusRequests(
      body
    );

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    return this.responsehandler.send(
      res,
      result.status,
      "عملیات با موفقیت انجام شد."
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
  // @Get('messages')
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
  // @Get('members')
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
  // @Get('/info/:username')
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

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.messengerChannelTransformer.collection(
      result.channels
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
}

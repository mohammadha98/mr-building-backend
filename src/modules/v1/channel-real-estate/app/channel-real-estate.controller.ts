import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Response,
  Query,
} from "@nestjs/common";
import { ChannelRealEstateService } from "./channel-real-estate.service";

import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v1//jwt-auth/jwt-auth.guard";
import { FormDataRequest } from "nestjs-form-data";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import MessageTransformer from "./Transformer";
import { GetMessagesChannelRealEstateDto } from "./dto/get-messages-channel-real-estate.dto";
import { JoinChannelRealEstateDto } from "./dto/join-channel-real-estate.dto";
import { StoreMessageChannelRealEstateDto } from "./dto/store-message-channel-real-estate.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-channel-real-estate")
@Controller("v1/app/channel-real-estate")
export class ChannelRealEstateController {
  constructor(
    private readonly channelRealEstateService: ChannelRealEstateService,
    private readonly ChannelRealEstateTransformer: MessageTransformer,
    private readonly responsehandler: HttpResponsehandler
  ) {}

  // عضویت در کانال
  @ApiCreatedResponse({
    description: "عضویت در کانال انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "عضویت در کانال انجام شد.",
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
  @ApiOperation({ summary: " عضویت در کانال" })
  @FormDataRequest()
  @Post("join")
  async joinChannel(
    @Body() body: JoinChannelRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** Join Channel RealEstate ***");
    console.log(body);

    const result = await this.channelRealEstateService.joinChannel(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler(
        "خطا . کانالی برای مشاور املاک موردنظر موجود نمیباشد."
      );
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 201, "عضویت در کانال انجام شد.");
  }

  // ترک کانال
  @ApiOkResponse({
    description: "ترک کانال با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "ترک کانال با موفقیت انجام شد.",
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
  @ApiOperation({ summary: "ترک کانال" })
  @FormDataRequest()
  @Delete("leave")
  async leaveChannel(
    @Body() body: JoinChannelRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** leave Channel RealEstate ***");
    console.log(body);

    const result = await this.channelRealEstateService.leaveChannel(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 200, "ترک کانال با موفقیت انجام شد.");
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
            user_channel: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                key: { type: "string" },
                agent_id: { type: "integer", example: 1 },
                name: { type: "string" },
                profile: { type: "string" },
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
            pinned: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  agent_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  profile: { type: "string" },
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
            channels: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  agent_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  profile: { type: "string" },
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
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست کانال های من" })
  @Get()
  async channelsList(@Request() req: any, @Response() res: Response) {
    console.log("*** List channels RealEstate ***");
    console.log({ client_id: req.user.id });

    const result = await this.channelRealEstateService.getMyChannels({
      client_id: req.user.id,
    });

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const user_channel = this.ChannelRealEstateTransformer.transform(
      result.user_channel
    );

    const channels = this.ChannelRealEstateTransformer.collection(
      result.channels
    );

    const pinned = this.ChannelRealEstateTransformer.collection(result.pinned);

    return this.responsehandler.send(
      res,
      result.status,
      "لیست کانال های شما در دسترس است.",
      {
        user_channel,
        pinned,
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
    @Query() query: GetMessagesChannelRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** Get Channel Messages ***");
    console.log({ query });
    const result = await this.channelRealEstateService.getMessages(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.ChannelRealEstateTransformer.messageCollection(
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

  // ارسال پیام در کانال
  @ApiCreatedResponse({
    description: "پیام شما با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "پیام شما با موفقیت ثبت شد.",
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
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  agent_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  profile: { type: "string" },
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
        },
      },
    },
  })
  @ApiOperation({ summary: "ارسال پیام در کانال" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("messages")
  async storeNewMessage(
    @Body() body: StoreMessageChannelRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** storeNewMessage in RealEstate Channel  ***");
    console.log({ body });
    const result = await this.channelRealEstateService.storeNewMessage(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.ChannelRealEstateTransformer.transform(
      result.result
    );

    return this.responsehandler.send(
      res,
      result.status,
      "پیام شما با موفقیت ثبت شد.",
      transformer
    );
  }
}

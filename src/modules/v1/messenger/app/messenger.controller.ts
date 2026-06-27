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
import { MessengerService } from "./messenger.service";
import { CreateChatMessenger } from "./dto/create-chat.dto";
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
import { GetMyCHatsDto } from "./dto/get-my-chats.dto";
import MessengerAppTransformer from "./Transformer";
import { GetMessagesDto } from "./dto/get-messages.dto";
import MessengerGroupsTransformer from "../../messenger_groups/app/Transformer";
import MessengerChannelTransformer from "../../messenger_channels/app/Transformer";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-messenger")
@Controller("v1/app/messenger")
export class MessengerController {
  constructor(
    private readonly messengerService: MessengerService,
    private readonly messengerTransformer: MessengerAppTransformer,
    private readonly responsehandler: HttpResponsehandler,
    private readonly messengerGroupsTransformer: MessengerGroupsTransformer,
    private readonly messengerChannelTransformer: MessengerChannelTransformer
  ) {}

  // ایجاد چت بین کاربر 1 و کاربر 2
  @ApiCreatedResponse({
    description: "درخواست شما با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "درخواست شما با موفقیت ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            key: { type: "string" },
            source: { type: "string", example: null },
            type: { type: "string", example: "starter, participant" },
            number_of_unread_messages: { type: "integer" },
            starter_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
                avatar: { type: "string" },
              },
            },
            participant_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
                avatar: { type: "string" },
              },
            },
            last_message: {
              type: "object",
              properties: {
                id: { type: "integer" },
                chat_key: { type: "string" },
                client_id: { type: "integer" },
                type: { type: "string" },
                content: { type: "string" },
                size: { type: "integer" },
                length: { type: "integer" },
                thumbnail: { type: "string" },
                seen: { type: "boolean" },
                is_replied: { type: "boolean" },
                is_forwarded: { type: "boolean" },
                is_edited: { type: "boolean" },
                have_reaction: { type: "boolean" },
                action: { type: "string" },
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
        },
      },
    },
  })
  @ApiOkResponse({
    description: "درخواست شما از قبل موجود میباشد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "درخواست شما از قبل موجود میباشد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            key: { type: "string" },
            source: { type: "string", example: null },
            type: { type: "string", example: "starter, participant" },
            number_of_unread_messages: { type: "integer" },
            starter_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
                avatar: { type: "string" },
              },
            },
            participant_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
                avatar: { type: "string" },
              },
            },
            last_message: {
              type: "object",
              properties: {
                id: { type: "integer" },
                chat_key: { type: "string" },
                client_id: { type: "integer" },
                type: { type: "string" },
                content: { type: "string" },
                size: { type: "integer" },
                length: { type: "integer" },
                thumbnail: { type: "string" },
                seen: { type: "boolean" },
                is_replied: { type: "boolean" },
                is_forwarded: { type: "boolean" },
                is_edited: { type: "boolean" },
                have_reaction: { type: "boolean" },
                action: { type: "string" },
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
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: " ایجاد چت" })
  @FormDataRequest()
  @Post()
  async storeChatRequest(
    @Body() createChatRealEstateDto: CreateChatMessenger,
    @Request() req: any,
    @Response() res: Response
  ) {
    createChatRealEstateDto.client_id = req.user.id;

    console.log("*** Create Chat: Messenger ***");
    console.log(createChatRealEstateDto);

    const result = await this.messengerService.storeChatRequest(
      createChatRealEstateDto
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. شخص مورد نظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.messengerTransformer.transform(result.result);
    return this.responsehandler.send(
      res,
      result.status,
      "درخواست شما از قبل موجود میباشد.",
      transformer
    );
  }

  // دریافت لیست چت کاربر
  // چت هایی که شروع کننده بوده
  // چت هایی که مشارکت کننده بوده
  @ApiOkResponse({
    description: "لیست چت های کاربر",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست چت های کاربر",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            blocked_account_ids: {
              type: "array",
              items: {
                type: "integer",
                properties: {},
              },
            },
            blocked_participant_ids: {
              type: "array",
              items: {
                type: "integer",
                properties: {},
              },
            },
            list: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  source: { type: "string", example: null },
                  type: { type: "string", example: "starter, participant" },
                  number_of_unread_messages: { type: "integer" },
                  starter_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
                  participant_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
                  last_message: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      chat_key: { type: "string" },
                      client_id: { type: "integer" },
                      type: { type: "string" },
                      content: { type: "string" },
                      size: { type: "integer" },
                      length: { type: "integer" },
                      thumbnail: { type: "string" },
                      seen: { type: "boolean" },
                      is_replied: { type: "boolean" },
                      is_forwarded: { type: "boolean" },
                      is_edited: { type: "boolean" },
                      have_reaction: { type: "boolean" },
                      action: { type: "string" },
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
  @ApiOperation({ summary: " چت های من" })
  @Get()
  async findMyChats(
    @Query() query: GetMyCHatsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** findMyChats: Messenger ***");
    console.log(query);

    const result = await this.messengerService.findMyChats(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const messengerTransformer = this.messengerTransformer.collection(
      result.chatList
    );

    return this.responsehandler.send(
      res,
      200,
      "لیست چت های کاربر در دسترس است.",
      {
        blocked_account_ids: result.blocked_account_ids,
        blocked_participant_ids: result.blocked_participant_ids,
        list: messengerTransformer,
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
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  chat_key: { type: "string" },
                  client_id: { type: "integer" },
                  client_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
                  type: { type: "string" },
                  content: { type: "string" },
                  size: { type: "integer" },
                  length: { type: "integer" },
                  seen: { type: "boolean" },
                  is_replied: { type: "boolean" },
                  is_forwarded: { type: "boolean" },
                  is_edited: { type: "boolean" },
                  have_reaction: { type: "boolean" },
                  action: { type: "string" },
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
  @ApiOperation({ summary: " لیست پیام های چت" })
  @Get("messages")
  async findMessages(
    @Query() query: GetMessagesDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** find Messages: Messenger ***");
    console.log(query);

    const result = await this.messengerService.findMessages(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("سابقه چت موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.messengerTransformer.messageCollection(
      result.result
    );
    const edited = this.messengerTransformer.messageCollection(result.edited);

    console.log("******");
    console.log("client_id ", query.client_id);
    console.log("length ", transformer.length);
    console.log("******");

    return this.responsehandler.send(res, 200, "لیست پیام ها در دسترس است.", {
      data: transformer,
      edited,
      deleted: result.deleted,
      metadata: result.metadata,
    });
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
        data: {},
      },
    },
  })
  @ApiOperation({ summary: "بخش همه(پیام های شخصی - پروه ها - کانال ها)" })
  @Get("all")
  async AllDataInMessenger(@Request() req: any, @Response() res: Response) {
    console.log("AllDataInMessenger: APP");
    console.log({ client_id: req.user.id });

    const result = await this.messengerService.AllDataInMessenger(req.user.id);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("سابقه چت موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const getPrivateChats = this.messengerTransformer.collection(
      result.getPrivateChats
    );

    const channels = this.messengerChannelTransformer.collection(
      result.getMessengerChannels,
      req.user.id
    );
    const groups = this.messengerGroupsTransformer.collection(
      result.getMessengerGroups,
      req.user.id
    );

    const allChats = [
      ...getPrivateChats,
      ...groups,
      ...channels,
      result.saveMessageService,
    ];

    const sortedChats = await this.messengerService.sortChatsByDate(allChats);

    return this.responsehandler.send(res, 200, "لیست پیام ها در دسترس است.", {
      blocked_account_ids: result.blocked_account_ids,
      blocked_participant_ids: result.blocked_participant_ids,
      data: sortedChats,
    });
  }
}

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
import { ChatRealEstateService } from "./chat-real-estate.service";
import { CreateChatRealEstateDto } from "./dto/create-chat-real-estate.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v2//jwt-auth/jwt-auth.guard";
import { FormDataRequest } from "nestjs-form-data";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { GetChatRealEstateDto } from "./dto/get-chat-real-estate.dto";
import MessageTransformer from "./Transformer";
import { GetMessagesChatRealEstateDto } from "./dto/get-messages-chat-real-estate.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-chat-real-estate")
@Controller("v2/app/chat-real-estate")
export class ChatRealEstateController {
  constructor(
    private readonly chatRealEstateService: ChatRealEstateService,
    private readonly chatRealEstateTransformer: MessageTransformer,
    private readonly responsehandler: HttpResponsehandler
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
            chat_type: { type: "string", example: "personal, estate_agent" },
            number_of_unread_messages: { type: "integer" },
            starter_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
              },
            },
            participant_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
              },
            },
            last_message: {
              type: "object",
              properties: {
                id: { type: "integer" },
                client_id: { type: "integer" },
                type: { type: "string" },
                message_side: {
                  type: "string",
                  example: "starter, participant",
                },
                content: { type: "string" },
                seen: { type: "boolean" },
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
            chat_type: { type: "string", example: "personal, estate_agent" },
            number_of_unread_messages: { type: "integer" },
            starter_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
              },
            },
            participant_info: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                phone: { type: "string" },
              },
            },
            last_message: {
              type: "object",
              properties: {
                id: { type: "integer" },
                client_id: { type: "integer" },
                type: { type: "string" },
                message_side: {
                  type: "string",
                  example: "starter, participant",
                },
                content: { type: "string" },
                seen: { type: "boolean" },
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
  @ApiOperation({ summary: "درخواست ایجاد چت" })
  @FormDataRequest()
  @Post()
  async storeChatRequest(
    @Body() createChatRealEstateDto: CreateChatRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    createChatRealEstateDto.client_id = req.user.id;

    console.log("*** storeChatRequest ***");
    console.log(createChatRealEstateDto);

    const result = await this.chatRealEstateService.storeChatRequest(
      createChatRealEstateDto
    );

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. شخص مورد نظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.chatRealEstateTransformer.transform(result.result);
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
            personal: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  source: { type: "string", example: null },
                  type: { type: "string", example: "starter, participant" },
                  chat_type: {
                    type: "string",
                    example: "personal, estate_agent",
                  },
                  number_of_unread_messages: { type: "integer" },
                  starter_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                      avatar: {
                        type: "string",
                        example: "avatar url || empty string",
                      },
                    },
                  },
                  participant_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                      avatar: {
                        type: "string",
                        example: "avatar url || empty string",
                      },
                    },
                  },
                  last_message: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      client_id: { type: "integer" },
                      type: { type: "string" },
                      message_side: {
                        type: "string",
                        example: "starter, participant",
                      },
                      content: { type: "string" },
                      seen: { type: "boolean" },
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
            real_estate_agent: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  source: { type: "string", example: null },
                  type: { type: "string", example: "starter, participant" },
                  chat_type: {
                    type: "string",
                    example: "personal, estate_agent",
                  },
                  number_of_unread_messages: { type: "integer" },
                  starter_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                      avatar: {
                        type: "string",
                        example: "avatar url || empty string",
                      },
                    },
                  },
                  participant_info: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" },
                      phone: { type: "string" },
                    },
                  },
                  last_message: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      client_id: { type: "integer" },
                      type: { type: "string" },
                      message_side: {
                        type: "string",
                        example: "starter, participant",
                      },
                      content: { type: "string" },
                      seen: { type: "boolean" },
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
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست چت های من" })
  @Get()
  async findMyChats(
    @Query() query: GetChatRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** findMyChats: RealEstate CHatHistory ***");
    console.log(query);

    const result = await this.chatRealEstateService.findMyChats(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. شخص مورد نظر وجود ندارد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const presentedPersonal = this.chatRealEstateTransformer.collection(
      result.presentedPersonal
    );

    const presentedRealEstateChats = this.chatRealEstateTransformer.collection(
      result.presentedRealEstateChats
    );

    return this.responsehandler.send(
      res,
      200,
      "لیست چت های کاربر در دسترس است.",
      {
        personal: presentedPersonal,
        real_estate_agent: presentedRealEstateChats,
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
                  client_id: { type: "integer" },
                  type: { type: "string" },
                  message_side: {
                    type: "string",
                    example: "starter, participant",
                  },
                  content: { type: "string" },
                  seen: { type: "boolean" },
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
    @Query() query: GetMessagesChatRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;

    console.log("*** findMessages: RealEstate CHatHistory => messages ***");
    console.log(query);

    const result = await this.chatRealEstateService.findMessages(query);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("سابقه چت موردتظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.chatRealEstateTransformer.messageCollection(
      result.result
    );

    return this.responsehandler.send(res, 200, "لیست پیام ها در دسترس است.", {
      data: transformer,
      metadata: result.metadata,
    });
  }
}

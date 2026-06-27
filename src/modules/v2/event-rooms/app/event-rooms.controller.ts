import {
  Controller,
  Get,
  Res,
  UseGuards,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from "@nestjs/common";
import { EventRoomsService } from "./event-rooms.service";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";

import { CreateEventRoomDto } from "./dto/Create-event-room.dto";
import { FormDataRequest } from "nestjs-form-data";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { UpdateEventRoomDto } from "./dto/update-event-room.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import { ClientEventsRoomsDto } from "./dto/Client-events-room.dto";
import { InvitedClientsIntoEventRoomDto } from "./dto/InvitedClientsInto-event-room.dto";
import { EventRoomPaginationDto } from "./dto/Event-room-pagination.dto";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";
import { Response } from "express";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-webinar-rooms")
@Controller("v2/app/webinar/rooms")
export class EventRoomsController {
  constructor(private readonly weninarService: EventRoomsService) {}

  // ایجاد اتاق جلسه
  @ApiCreatedResponse({
    description: "اتاق جدید با موفقیت ایجاد شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "اتاق جدید با موفقیت ایجاد شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            is_owner: { type: "boolean", example: false },
            title: { type: "string" },
            type: {
              type: "string",
              example: "نوع وبنیار: private",
            },
            tag: { type: "string" },
            guest_count: { type: "number" },
            event_link: { type: "string" },
            status: {
              type: "string",
              example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
            },
            created_at: { type: "string" },
            login_info: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiBody({ type: CreateEventRoomDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "ایجاد اتاق جلسه" })
  @FormDataRequest()
  @Post()
  async store(@Body() createEventRoomDto: CreateEventRoomDto) {
    return await this.weninarService.store(createEventRoomDto);
  }

  // دریافت اتاقهای ثبت شده توسط کاربر
  @ApiOperation({
    summary: "دریافت اتاق های ایجاد شده توسط کاربر",
    description: "در این بخش لیست اتاق های ایجاد شده توسط کاربر ارسال میشود",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست اتاقهای کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست اتاقهای کاربر در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            is_owner: { type: "boolean", example: false },
            title: { type: "string" },
            type: {
              type: "string",
              example: "نوع وبنیار: private",
            },
            tag: { type: "string" },
            guest_count: { type: "number" },
            event_link: { type: "string" },
            status: {
              type: "string",
              example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
            },
            created_at: { type: "string" },
            login_info: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
    },
  })

  // @Get()
  async findAllMyOwnWebinars() {
    return await this.weninarService.findAllMyOwnWebinars();
  }

  // دریافت اتاق های کاربر
  @ApiOperation({
    summary: "دریافت اتاق های کاربر",
    description:
      "لیست اتاق های کاربر بر اساس ماه و سال جاری ارسال میشود. \n \nماه و سال به میلادی و به صورت عددی ارسال شود",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست اتاقهای کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست اتاقهای کاربر در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  is_owner: { type: "boolean", example: false },
                  title: { type: "string" },
                  type: {
                    type: "string",
                    example: "نوع وبنیار: private",
                  },
                  tag: { type: "string" },
                  guest_count: { type: "number" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  created_at: { type: "string" },
                  login_info: {
                    type: "object",
                    properties: {
                      username: { type: "string" },
                      password: { type: "string" },
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
  @ApiQuery({ type: ClientEventsRoomsDto })
  @Get("/me")
  async findAllMyRooms(@Query() query: EventRoomPaginationDto) {
    return await this.weninarService.findAllMyRooms(query);
  }

  // لیست کاربران دعوت شده به اتاق در دسترس است.
  @ApiOperation({
    summary: " لیست کاربران دعوت شده به اتاق",
    description: "دریافت لیست کاربران دعوت شده به اتاق",
  })
  @ApiConsumes("multipart/form-data")

  // ok response
  @ApiOkResponse({
    description: "لیست کاربران دعوت شده به اتاق در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست کاربران دعوت شده به اتاق در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              client_id: { type: "integer", example: 12 },
              userid: { type: "integer", example: 12 },
              display_name: {
                type: "strint",
                example: "پوریا میرخباز",
              },
              phone: { type: "string", example: "09183372684" },
              role: { type: "string", example: "teacher" },
            },
          },
        },
      },
    },
  })
  @Get("/users")
  async findInvitedWebinars(@Query() query: InvitedClientsIntoEventRoomDto) {
    return await this.weninarService.findInvitedWebinars(query.room_id);
  }

  // حذف اتاق
  @ApiOkResponse({
    description: "اتاق موردنظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "اتاق موردنظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف اتاق" })
  @Delete(":room_id")
  async deleteWebinar(@Param() deleteWebinarDto: DeleteEventRoomDto) {
    return this.weninarService.deleteWebinar(deleteWebinarDto);
  }

  // ویرایش اتاق
  @ApiOkResponse({
    description: "اتاق با موفقیت ویرایش شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "اتاق با موفقیت ویرایش شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            is_owner: { type: "boolean", example: false },
            title: { type: "string" },
            type: {
              type: "string",
              example: "نوع وبنیار: private",
            },
            tag: { type: "string" },
            guest_count: { type: "number" },
            event_link: { type: "string" },
            status: {
              type: "string",
              example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
            },
            created_at: { type: "string" },
            login_info: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "ویرایش اتاق" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  // @Patch()
  async updateWbinar(@Body() updateWebinarDto: UpdateEventRoomDto) {
    return await this.weninarService.updateWebinar(updateWebinarDto);
  }

  // افزودن مخاطبین به اتاق
  @ApiOperation({
    summary: "افزودن مخاطبین به اتاق",
    description: "مخاطبین خود را به اتاق دعوت کنید.",
  })
  @ApiOkResponse({
    description: "مخاطبین شما به اتاق اضافه شدند.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "مخاطبین شما به اتاق اضافه شدند.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @Post("/invite")
  async inviteContactToEventRoom(
    @Body() inviteContactDto: InviteContactDto,
    @Res() res: Response
  ) {
    return await this.weninarService.inviteContactToEventRoom(
      inviteContactDto,
      res
    );
  }
}

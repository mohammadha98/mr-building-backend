import {
  Controller,
  Get,
  Res,
  Request,
  Response,
  UseGuards,
  Query,
  Delete,
  Param,
} from "@nestjs/common";
import { EventRoomsService } from "./event-rooms.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import EventRoomsTransformer from "./Transformer";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";

import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InvitedClientsIntoEventRoomDto } from "./dto/InvitedClientsInto-event-room.dto";
import EventService from "src/modules/v1//webinar/provider/EventService";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-webinar-rooms")
@Controller("v1/admin/webinar/rooms")
export class EventRoomsController {
  private responsehandler: HttpResponsehandler;
  private roomTransformer: EventRoomsTransformer;
  private eventService: EventService;

  constructor(private readonly weninarService: EventRoomsService) {
    this.responsehandler = new HttpResponsehandler();
    this.roomTransformer = new EventRoomsTransformer();
    this.eventService = new EventService();
  }

  //  لیست وبینارها
  @ApiOperation({
    summary: "لیست وبینارها",
    description: "صفحه بندی وجود دارد.",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست وبینارهای کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست وبینارهای کاربر در دسترس است.",
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
                  description: { type: "string" },
                  type: {
                    type: "string",
                    example: "private, public",
                  },
                  tag: { type: "string" },
                  event_link: { type: "string" },
                  status: {
                    type: "string",
                    example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                  },
                  proceeding: { type: "string", example: "متن صورتجلسه" },
                  guest_access: {
                    type: "string",
                    example:
                      "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                  },
                  guest_count: {
                    type: "integer",
                    example:
                      "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                  },
                  created_at: { type: "string" },
                  started_at: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
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
  @Get("/list")
  async findAllMyOwnWebinars(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Res() res: Response
  ) {
    query.user_id = req.user.id;
    const weninars = await this.weninarService.findAllMyOwnWebinars(query);
    if (weninars.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (weninars.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    const webinarTransformer = this.roomTransformer.collection(
      weninars.list as any,
      weninars.client_info
    );
    return this.responsehandler.send(
      res,
      200,
      "لیست اتاق های جلسه در دسترس است.",
      {
        data: webinarTransformer,
        metadata: weninars.metadata,
      }
    );
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
  // @Get("/users")
  async findInvitedWebinars(
    @Query() query: InvitedClientsIntoEventRoomDto,
    @Res() res: Response
  ) {
    const data = await this.weninarService.findInvitedWebinars(query.room_id);

    const roomTransformer = this.roomTransformer.guestCollection(data);
    return this.responsehandler.send(
      res,
      200,
      "لیست کاربران دعوت شده به اتاق در دسترس است.",
      roomTransformer
    );
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
  async deleteWebinar(
    @Param() deleteWebinarDto: DeleteEventRoomDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    deleteWebinarDto.user_id = req.user.id;
    const result = await this.weninarService.deleteRoom(deleteWebinarDto);

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    return this.responsehandler.send(
      res,
      200,
      "اتاق موردنظر با موفقیت حذف شد."
    );
  }
}

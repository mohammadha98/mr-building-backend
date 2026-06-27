import {
  Controller,
  Get,
  Res,
  Request,
  Response,
  UseGuards,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from "@nestjs/common";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import EventsTransformer from "./Transformer";
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

import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import { CreateEventGroupDto } from "./dto/Create-event-group.dto";
import { FormDataRequest } from "nestjs-form-data";
import { DeleteEventGroupDto } from "./dto/delete-event-groupdto.ts";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { ClientEventsGroupsDto } from "./dto/Client-events-groups.dto";
import EventService from "src/modules/v2//webinar/provider/EventService";
import { EventGroupPaginationDto } from "./dto/Event-group-pagination.dto";
import { eventGroupsService } from "./event-groups.service";
import AdminTokenAuthGuard from "../../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin-events-groups")
@Controller("v2/admin/events/groups")
export class EventsGroupController {
  private responsehandler: HttpResponsehandler;
  private Transformer: EventsTransformer;
  private eventService: EventService;
  constructor(private readonly groupsService: eventGroupsService) {
    this.responsehandler = new HttpResponsehandler();
    this.Transformer = new EventsTransformer();
    this.eventService = new EventService();
  }

  // دریافت گروه ها
  @ApiOperation({
    summary: "دریافت گروه های کاربر",
  })
  @ApiConsumes("multipart/form-data")
  // ok response
  @ApiOkResponse({
    description: "لیست گروههای کاربر در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گروههای کاربر در دسترس است.",
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
                  title: { type: "string" },
                  tag: { type: "string" },
                  event_link: { type: "string" },
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
  @ApiQuery({ type: ClientEventsGroupsDto })
  @Get()
  async findGroups(
    @Query() query: EventGroupPaginationDto,
    @Request() req: any,
    @Res() res: Response
  ) {
    query.client_id = req.user.id;
    const result = await this.groupsService.findAllGroups(query);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    const Transformer = this.Transformer.collection(result.groups as any);
    return this.responsehandler.send(
      res,
      200,
      "لیست گروههای کاربر در دسترس است.",
      { data: Transformer, metadata: result.metadata }
    );
  }

  // حذف گروه
  @ApiOkResponse({
    description: "گروه موردنظر با موفقیت حذف شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "گروه موردنظر با موفقیت حذف شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "حذف گروه" })
  @Delete(":group_id")
  async deleteWebinar(
    @Param() group_id: DeleteEventGroupDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    group_id.user_id = req.user.id;
    const result = await this.groupsService.deleteWebinar(group_id);

    if (result.status === 500) {
      throw new InternalServerErrorSchema();
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    }

    return this.responsehandler.send(
      res,
      200,
      "گروه موردنظر با موفقیت حذف شد."
    );
  }
}

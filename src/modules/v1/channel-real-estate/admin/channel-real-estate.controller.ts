import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  Get,
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
import { FormDataRequest } from "nestjs-form-data";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import MessageTransformer from "./Transformer";
import { PinnedChannelRealEstateDto } from "./dto/pinned-channel-real-estate.dto";
import { GetChannelsDto } from "./dto/get-channels-pagination..dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-channel-real-estate")
@Controller("v1/admin/channel-real-estate")
export class ChannelRealEstateController {
  constructor(
    private readonly channelRealEstateService: ChannelRealEstateService,
    private readonly ChannelRealEstateTransformer: MessageTransformer,
    private readonly responsehandler: HttpResponsehandler
  ) {}

  // دریافت لیست کانال ها
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
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  key: { type: "string" },
                  agent_id: { type: "integer", example: 1 },
                  name: { type: "string" },
                  profile: { type: "string" },
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
  @ApiOperation({ summary: "لیست کانال ها " })
  @Get()
  async channelsList(
    @Query() query: GetChannelsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    console.log("*** List channels RealEstate: ADMIN ***");
    query.user_id = req.user.id;
    console.log(query);

    const result = await this.channelRealEstateService.getChannels(query);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const channels = this.ChannelRealEstateTransformer.collection(
      result.channels
    );

    return this.responsehandler.send(
      res,
      result.status,
      "لیست کانال های شما در دسترس است.",
      {
        data: channels,
        metadata: result.metadata,
      }
    );
  }

  // پین کردن یک کانال
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
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "پین کردن کانال" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("pinned")
  async pinnedChannel(
    @Body() body: PinnedChannelRealEstateDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.user_id = req.user.id;

    console.log("*** pinned Channel in RealEstate ***");
    console.log({ body });
    const result = await this.channelRealEstateService.pinnedChannel(body);

    if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
    } else if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responsehandler.send(res, 201, "پین با موفقیت ثبت شد.");
  }
}

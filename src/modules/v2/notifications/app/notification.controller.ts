import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";

import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FormDataRequest } from "nestjs-form-data";
import { NotificationsService } from "./notifications.service";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
import TokenAuthGuardClient from "src/modules/v1/jwt-auth/TokenAuthGuardClient";

@ApiSecurity("JWT-auth")
@ApiTags("v1/app-notification")
@Controller("v1/app/notification")
export class NotificationController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @UseGuards(TokenAuthGuardClient)
  @Post()
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "ذخیره توکن fcm" })
  async saveNotificationFoClient(
    @Body() body: SaveNotificationTokenDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    console.log("saveNotificationFoClient");
    console.log(body);

    const result = await this.notificationsService.saveNotificationFoClient(
      body
    );
    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد.");
  }

}

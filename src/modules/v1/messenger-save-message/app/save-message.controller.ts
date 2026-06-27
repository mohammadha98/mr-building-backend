import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { MessengerSaveMessageService } from "./save-message.service";
import { ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { GetMessagesDto } from "./dto/get-messages.dto";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/messenger/save-message")
@Controller("v1/app/messenger/save-message")
export class MessengerSaveMessageController {
  constructor(
    private readonly saveMessageService: MessengerSaveMessageService
  ) {}

  // لیست پیام ها
  @ApiOperation({ summary: " لیست پیام های سیو مسیج" })
  @Get("messages")
  async findMessages(@Query() query: GetMessagesDto) {
    console.log("*** find Messages: SaveMessage ***");
    console.log(query);

    return await this.saveMessageService.findMessages(query);
  }
}

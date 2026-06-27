import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";
import { MarketplaceMessengerService } from "./marketplace-messenger.service";
import { CreateChatInMarketplaceDto } from "./dto/create-chat-in-marketplace.dto";
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";
import { GetMessagesDto } from "../../messenger/app/dto/get-messages.dto";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/marketplace/messenger")
@Controller("v1/app/marketplace/messenger")
export class MarketplaceMessengerController {
  constructor(private readonly chatService: MarketplaceMessengerService) {}

  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "درخواست ایجاد چت" })
  @FormDataRequest()
  @Post()
  async storeChatRequest(@Body() body: CreateChatInMarketplaceDto) {
    console.log("*** store request: Marketplace CHAT ***");
    console.log(body);

    return await this.chatService.storeChatRequest(body);
  }

  @ApiOperation({ summary: "لیست چت های من" })
  @Get()
  async findMyChats() {
    console.log("*** find My Chats: Marketplace chat History ***");
    return this.chatService.findMyChats();
  }

  @ApiOperation({ summary: " لیست پیام های چت" })
  @Get("messages")
  async findMessages(@Query() query: GetMessagesDto) {
    console.log("*** findMessages: Marketplace CHat History ***");
    console.log(query);

    return this.chatService.findMessages(query);
  }
}

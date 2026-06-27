import { Injectable } from "@nestjs/common";
import { MarketplaceMessenger_MessageSection } from "../marketplace-messenger-message.service";

@Injectable()
export class MarketplaceMessengerFactory {
  constructor(
    private readonly marketplaceMessenger_MessageSection: MarketplaceMessenger_MessageSection
  ) {}

  public async saveMessage(body: any) {
    return await this.marketplaceMessenger_MessageSection.saveMessage(body);
  }

  public async deleteMessage(body: any) {
    return await this.marketplaceMessenger_MessageSection.deleteMessage(body);
  }

  public async seenMessages(body: any) {
    return await this.marketplaceMessenger_MessageSection.seenMessages(body);
  }
}

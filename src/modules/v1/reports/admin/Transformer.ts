import { Injectable } from "@nestjs/common";

@Injectable()
export default class ReportsTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      type: item.type,
      content: item.content,
      image: item.image
        ? `${process.env.APP_CONTENT_PATH}/report_bugs/${item.image}`
        : null,
      voice: item.image
        ? `${process.env.APP_CONTENT_PATH}/report_bugs/${item.voice}`
        : null,
      client: this.clientInfo(item.client),
      created_at: item.created_at,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public violationTransform(item: any) {
    return {
      id: item.id,
      description: item.description,
      type: item.type,
      client: this.clientInfo(item.client),
      created_at: item.created_at,
    };
  }

  public violationCollection(items: any[]) {
    return items.map((item) => this.violationTransform(item));
  }

  private clientInfo(client: any) {
    return {
      id: client.id,
      name: client.name + " " + client.surname,
      phone: client.phone,
    };
  }
}

import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class PrizesTransformer implements ITransformer<any> {
  constructor() {}

  public transform(item: any) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      point: item.point,
      thumbnail: item.thumbnail
        ? process.env.APP_CONTENT_PATH + "/prizes/" + item.thumbnail
        : "",
      coupons: item.coupons,
      url: item.url,
      status: item.status,
      created_at: item.created_at,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}

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
      coupon: item.coupon,
      url: item.url,
      thumbnail: item.thumbnail
        ? process.env.APP_CONTENT_PATH + "/prizes/" + item.thumbnail
        : "",
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public missionTransform(item: any) {
    return {
      id: item.id,
      key: item.key,
      title: item.title,
      description: item.description,
      point: item.point,
      mission_done: item.mission_done,
      is_limited: item.is_limited,
      number_of_hours: item.number_of_hours,
      is_permitted: item.is_permitted,
      last_used_at: item.usedAt,
    };
  }

  public missionCollection(items: any[]) {
    return items.map((item) => this.missionTransform(item));
  }

  public historyOfScorTransform(item: any) {
    return {
      id: item.id,
      title: item.title,
      score: item.score,
      action: item.action,
    };
  }

  public historyOfScorCollection(items: any[]) {
    return items.map((item) => this.historyOfScorTransform(item));
  }
}

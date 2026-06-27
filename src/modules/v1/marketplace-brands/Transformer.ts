import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class MarketplaceBrandsTransformer implements ITransformer<any> {
  public transform(item: any) {
    return {
      id: item.id,
      title: item.title,
      second_title: item.secondTitle,
      description: item.description,
      color: item.color,
      score: item.score,
      total_score: item.total_score,
      status: item.status,
      thumbnail: item.thumbnail
        ? `${process.env.APP_CONTENT_PATH}/marketplace/brands/${item.thumbnail}`
        : null,
    };
  }
  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export default class ReportsTransformer {
  public transform(item: any) {
    return {
      id: item.id,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export default class TermsOfServicetarnsformer {
  public transform(item: any) {
    return {
      content: item.content,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}

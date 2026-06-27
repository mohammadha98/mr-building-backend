import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class MarketplaceCategoriesTransformer
  implements ITransformer<any>
{
  public transform(item: any) {
    let formItems = [];

    if (item.items.length) {
      item.items.map((item) => {
        const subCategory = {
          id: item.id,
          title: item.title,
          form_items: item.form ? item.form.items : [],
        };
        formItems = [...formItems, subCategory];
      });
    }

    return {
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail
        ? `${process.env.APP_CONTENT_PATH}/marketplace/categories/${item.thumbnail}`
        : null,
      sub_categories: formItems,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}

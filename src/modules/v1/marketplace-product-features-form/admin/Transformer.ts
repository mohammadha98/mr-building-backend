import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class ProductFeatureFormsTransformer
  implements ITransformer<any>
{
  public transformItem(item: any) {
    return {
      id: item.id,
      field_name: item.field_name,
      type: item.type,
      is_active: item.is_active,
      required: item.required,
      field_type: item.field_type,
      values: item.values,
      sort_number: item.sort_number,
      status: item.status,
      key: item.key,
    };
  }
  public collectionItem(items: any[]) {
    return items.map((item) => this.transformItem(item));
  }

  public transform(item: any) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
    };
  }
  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}

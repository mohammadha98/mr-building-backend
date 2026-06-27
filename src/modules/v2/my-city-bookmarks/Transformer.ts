import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";
import * as moment from "moment";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import * as process from "process";

@Injectable()
export default class BookmarkCityTransformer implements ITransformer<any> {
  public transform(item: any) {
    return {
      id: item.id,
      location_info: this.locationInfo(item.myCity),
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public locationInfo(item: any) {
    return {
      id: item.id,
      title: item.title,
      latitude: item.latitude,
      longitude: item.longitude,
      category: item.category,
      province: this.cityInfo(item.province),
      city: this.cityInfo(item.city),
    };
  }

  public cityInfo(item: any) {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      name: item.name,
    };
  }
}

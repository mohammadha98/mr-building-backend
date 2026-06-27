import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";
import * as process from "process";

@Injectable()
export default class MyCityTransformer implements ITransformer<any> {
  public transform(item: any) {
    return {
      id: item.id,
      client: this.clientIfo(item.client),
      category: item.category,
      province: this.cityInfo(item.province),
      city: this.cityInfo(item.city),
      title: item.title,
      latitude: item.latitude,
      longitude: item.longitude,
      status: item.status,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public localtionDetails(item: any) {
    return {
      id: item.id,
      client: this.clientIfo(item.client),
      category: item.category,
      title: item.title,
      description: item.description,
      size: item.size,
      number_of_rooms: item.number_of_rooms,
      renovation_tax: item.renovation_tax,
      latitude: item.latitude,
      longitude: item.longitude,
      status: item.status,
      province: this.cityInfo(item.province),
      city: this.cityInfo(item.city),
      files: this.collectionFile(item.media),
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

  public clientIfo(item: any) {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      name: item.name,
      surname: item.surname,
      phone: item.phone,
    };
  }

  public transformFile(item: any) {
    if (!item) {
      return {
        id: -1,
        file_name: "",
        tag: "",
        file_type: null,
        file_url: "",
        sort_number: -1,
        priority: null,
        thumbnail: null,
      };
    }
    return {
      id: item.id,
      file_name: item.file_name,
      tag: item.tag,
      file_type: item.file_type,
      file_url: process.env.APP_CONTENT_PATH + item.file_name,
      sort_number: item.sort_number,
      priority: item.priority,
      thumbnail: process.env.APP_CONTENT_PATH + item.thumbnail,
    };
  }

  public collectionFile(items: any[]) {
    return items.map((item) => this.transformFile(item));
  }
}

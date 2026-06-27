import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";
import * as moment from "moment";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import * as process from "process";
import { convertDateToPersian } from "src/commons/utils/convertDateToPersian";
import { AdsDetailTags } from "../app/dto/get-details-real-estate-ads.dto";

@Injectable()
export default class RealEstateAdsTransformer implements ITransformer<any> {
  transform: (item: any) => void;
  collection: (items: any[]) => void;

  public transformDetails(item: any) {
    let items;

    let owner_info: any = {};
    let dest = "real_estate_ads";
    if (item.tag === AdsDetailTags.divar) {
      owner_info.name = item.owner_name;
      owner_info.phone = item.owner_phone;
      owner_info.avatar = "";

      dest = "real_estate_ads/scraper";
      const AdItems = item.robotAdItems as any;
      items = this.collectionRobotAdItems(AdItems.length ? AdItems : []);
    } else {
      owner_info = item.owner_info;
      const AdItems = item.RealEstateAdForms as any;
      items = this.collectionAdItems(AdItems.length ? AdItems : []);
    }

    return {
      id: item.id,
      tag: item.tag,
      category: this.categoryInfo(item.category),
      sub_category: this.categoryInfo(item.subCategory),
      tracking_code: item.tracking_code,
      seller_type: item.seller_type,
      is_applicant: item.is_applicant,
      owner_id: this.getOwnerId(item),
      display_contact: item.display_contact,
      title: item.title,
      description: item.description,
      sale_price: item.sale_price.toString(),
      deposit_price: item.deposit_price.toString(),
      rent_price: item.rent_price.toString(),
      number_of_rooms: item.number_of_rooms,
      max_capicity: item.max_capicity,
      size: item.size,
      year_built: item.year_built,
      normal_days_price: item.normal_days_price.toString(),
      weekend_price: item.weekend_price.toString(),
      special_days_price: item.special_days_price.toString(),
      cost_per_additional_person: item.cost_per_additional_person.toString(),
      extra_people: item.extra_people,
      agent_valuation_request: item.agent_valuation_request,
      price_status: item.price_status,
      price_rating: item.price_rating,
      latitude: item.lat_item,
      longitude: item.long_item,
      status: item.status,
      is_timed: item.is_timed,
      expired_at: item.expired_at,
      province: this.cityInfo(item.province),
      city: this.cityInfo(item.city),
      area: item.area,
      items,
      media: this.collectionFile(item.media, dest, item.tag),
      owner_info,
      created_at: this.calculCreatedAt(item.created_at),
      created_time: item.created_at,
    };
  }

  public categoryInfo(item: any) {
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      title: item.title,
      type: item.type,
    };
  }

  public collectionDetails(items: any[]) {
    return items.map((item) => this.transformDetails(item));
  }

  private getOwnerId(item: any) {
    if (item.seller_type === RealEstateAdSellerTypes.individual) {
      return item.client_id;
    } else if (item.seller_type === RealEstateAdSellerTypes.real_estate_agent) {
      return item.agent_id;
    } else if (item.seller_type === RealEstateAdSellerTypes.advisor) {
      return item.advisor_id;
    }
  }

  public transformAdList(item: any) {
    let owner_info: any = {};
    let dest = "real_estate_ads";
    if (item.tag === AdsDetailTags.divar) {
      owner_info.name = item.owner_name;
      owner_info.phone = item.owner_phone;
      owner_info.avatar = "";
      dest = "real_estate_ads/scraper";
    } else {
      owner_info = item.owner_info;
    }

    return {
      id: item.id,
      tag: item.tag,
      tracking_code: item.tracking_code,
      category: this.categoryInfo(item.category),
      sub_category: this.categoryInfo(item.subCategory),
      title: item.title,
      is_applicant: item.is_applicant,
      status: item.status,
      reasons: item.Reasons ? item.Reasons : [],
      sale_price: item.sale_price.toString(),
      deposit_price: item.deposit_price.toString(),
      rent_price: item.rent_price.toString(),
      number_of_rooms: item.number_of_rooms,
      max_capicity: item.max_capicity,
      normal_days_price: item.normal_days_price.toString(),
      province: this.cityInfo(item.province),
      city: this.cityInfo(item.city),
      area: item.area,
      seller_type: item.seller_type,
      owner_info,
      created_at: this.calculCreatedAt(item.created_at),
      createdAt: item.created_at,
      media: this.transformFile(item.media[0], dest, item.tag),
    };
  }

  public collectionAdList(items: any[]) {
    return items.map((item) => this.transformAdList(item));
  }

  public transformSettingItem(item: any) {
    return {
      id: item.id,
      field_name: item.field_name,
      type: item.type,
      field_type: item.field_type,
      values: item.values,
      sort_number: item.sort_number,
    };
  }

  public collectionSettingItems(items: any[]) {
    return items.map((item) => this.transformSettingItem(item));
  }

  public cityInfo(item: any) {
    return {
      id: item.id,
      name: item.name,
    };
  }

  public transformFile(item: any, destination: string, tag: string) {
    if (!item) {
      return {
        id: -1,
        file_name: "",
        file_type: null,
        file_url: "",
        sort_number: -1,
        priority: null,
        thumbnail: null,
      };
    }
    let file_url =
      process.env.APP_CONTENT_PATH + `/${destination}/` + item.file_name;
    let thumbnail = item.thumbnail
      ? process.env.APP_CONTENT_PATH + item.thumbnail
      : null;

    if (tag === AdsDetailTags.divar) {
      file_url = process.env.APP_URL + item.file_name;
      thumbnail = process.env.APP_URL + item.file_name;
    }

    return {
      id: item.id,
      file_name: item.file_name,
      file_type: item.file_type,
      file_url,
      sort_number: item.sort_number,
      priority: item.priority,
      thumbnail,
    };
  }

  public collectionFile(items: any[], destination: string, tag: string) {
    return items.map((item) => this.transformFile(item, destination, tag));
  }

  public transformAdItem(item: any) {
    if (!item) {
      return null;
    }
    console.log(item.id);
    console.log(item.form.id);
    return {
      id: item.id,
      item_id: item.form.id,
      field_type: item.form.field_type,
      field_name: item.form.field_name,
      value: item.value,
      icon:
        process.env.APP_CONTENT_PATH +
        "/real_estate_ad_forms/icons/" +
        item.form.icon,
      sort_number: item.form.sort_number,
    };
  }

  public collectionAdItems(list) {
    return list.map((ad) => this.transformAdItem(ad));
  }

  public transformRobotAdItem(item: any, index: number) {
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      item_id: item.id,
      field_type: "input_number",
      field_name: item.field_name,
      value: item.value,
      icon: "",
      sort_number: index,
    };
  }

  public collectionRobotAdItems(list) {
    return list.map((ad, index) => this.transformRobotAdItem(ad, index));
  }

  private calculCreatedAt(created_at: string) {
    // تبدیل تاریخ به شیء Moment.js
    const date = moment(created_at);

    // محاسبه تفاوت زمانی با تاریخ فعلی
    const diffSeconds = moment().diff(date, "seconds");
    const diffMinutes = moment().diff(date, "minutes");
    const diffHours = moment().diff(date, "hours");
    const diffDays = moment().diff(date, "days");
    const diffWeeks = moment().diff(date, "weeks");
    const diffMonths = moment().diff(date, "months");
    const diffYears = moment().diff(date, "years");

    let formattedDate;
    if (diffSeconds <= 60) {
      formattedDate = `لحظاتی پیش`;
    } else if (diffMinutes <= 60) {
      formattedDate = `${diffMinutes} دقیقه پیش`;
    } else if (diffHours <= 24) {
      formattedDate = `${diffHours} ساعت پیش`;
    } else if (diffDays <= 7) {
      formattedDate = `${diffDays} روز پیش`;
    } else if (diffWeeks <= 4) {
      formattedDate = `${diffWeeks} هفته پیش`;
    } else if (diffMonths <= 12) {
      formattedDate = `${diffMonths} ماه پیش`;
    } else {
      formattedDate = `${diffYears} سال پیش`;
    }
    return formattedDate;
  }

  public assortmentTransform(item: any) {
    return {
      id: item.id,
      title: item.title,
      type: item.type,
      sub_categories: this.subCategoryCollection(
        item.RealEstateAdSubCategory as any
      ),
    };
  }

  public assortmentCollection(items: any[]) {
    return items.map((item) => this.assortmentTransform(item));
  }

  public subCategoryTransform(item: any) {
    return {
      id: item.id,
      title: item.title,
      form_items: this.collectionFormItem(item.form.items),
    };
  }

  public subCategoryCollection(items: any[]) {
    return items.map((item) => this.subCategoryTransform(item));
  }

  public transformFormItem(item: any) {
    if (!item) {
      return {};
    }

    return {
      id: item.id,
      field_name: item.field_name,
      type: item.type,
      // is_active: item.is_active,
      // required: item.required,
      field_type: item.field_type,
      values: item.values,
      sort_number: item.sort_number,
      status: item.status,
      icon:
        process.env.APP_CONTENT_PATH +
        "/real_estate_ad_forms/icons/" +
        item.icon,
      key: item.key,
    };
  }

  public collectionFormItem(items: any[]) {
    return items.map((item) => this.transformFormItem(item));
  }

  public transformNotificationSettings(item: any) {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      title: item.title,
      smsNotification: item.smsNotification,
      whatsappNotification: item.whatsappNotification,
      expired_at: item.expired_at
        ? convertDateToPersian(item.expired_at)
        : null,
      sale_price: item.sale_price.toString(),
      deposit_price: item.deposit_price.toString(),
      rent_price: item.rent_price.toString(),
      year_built: item.year_built,
      size: item.size,
      provinceId: item.provinceId,
      cityId: item.cityId,
      categoryId: item.categoryId,
    };
  }

  public collectionNotificationSettings(items: any[]) {
    return items.map((item) => this.transformNotificationSettings(item));
  }
}

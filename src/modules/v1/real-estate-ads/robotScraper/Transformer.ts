import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";
import * as moment from "moment";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import * as process from "process";

@Injectable()
export default class RealEstateAdsTransformer implements ITransformer<any> {
  transform: (item: any) => void;
  collection: (items: any[]) => void;
  public transformDetails(item: any) {
    const items = item.items as any;
    return {
      id: item.id,
      tag: "divar",
      category: this.categoryInfo(item.category),
      sub_category: this.categoryInfo(item.subCategory),
      tracking_code: item.tracking_code,
      seller_type: item.seller_type,
      is_applicant: item.is_applicant,
      display_contact: true,
      agent_valuation_request: false,
      owner_id: -1,
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
      price_status: item.price_status,
      price_rating: item.price_rating,
      latitude: item.lat_item,
      longitude: item.long_item,
      status: item.status,
      province: this.cityInfo(item.province),
      city: this.cityInfo(item.city),
      area: item.area,
      items: this.collectionAdItems(items.length ? items : []),
      media: this.collectionFile(item.media),
      owner_info: this.getOwnerInfo(item.owner_name, item.owner_phone),
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
  public getOwnerInfo(owner_name: string, owner_phone: string) {
    return {
      name: owner_name,
      phone: owner_phone,
      avatar: "",
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
    return {
      id: item.id,
      tag: "divar",
      tracking_code: item.tracking_code,
      category: this.categoryInfo(item.category),
      sub_category: this.categoryInfo(item.subCategory),
      title: item.title,
      is_applicant: item.is_applicant,
      agent_valuation_request: false,
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
      owner_info: this.getOwnerInfo(item.owner_name, item.owner_phone),
      created_at: this.calculCreatedAt(item.created_at),
      createdAt: item.created_at,
      media: this.transformFile(item.media[0]),
    };
  }
  public collectionAdList(items: any[]) {
    return items.map((item) => this.transformAdList(item));
  }

  public cityInfo(item: any) {
    return {
      id: -1,
      name: item,
    };
  }

  public transformFile(item: any) {
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
    return {
      id: item.id,
      file_name: process.env.APP_URL + item.file_name,
      file_type: item.file_type,
      file_url: process.env.APP_URL + item.file_name,
      sort_number: item.sort_number,
      priority: item.priority,
      thumbnail: null,
    };
  }

  public collectionFile(items: any[]) {
    return items.map((item) => this.transformFile(item));
  }

  public transformAdItem(item: any) {
    if (!item) {
      return null;
    }
    return {
      id: "",
      item_id: "",
      field_type: "input_string",
      field_name: item.field_name,
      value: item.value,
      icon: "",
      sort_number: "",
    };
  }

  public collectionAdItems(list) {
    return list.map((ad) => this.transformAdItem(ad));
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
      // form_items: this.collectionFormItem(item.form.items),
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
}

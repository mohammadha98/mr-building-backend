import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
import { Storefront } from "@prisma/client";
jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class StorefrontAdminTransformer {
  public transform(item: Partial<Storefront> | any) {
    return {
      id: item.id,
      tracking_code: item.trackingCode,
      client_id: this.clientInfo(item.client),
      name: item.name,
      description: item.description,
      color: item.color,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/storefronts/${item.id}/avatars/${item.avatar}`
        : "",
      license: item.license
        ? `${process.env.APP_CONTENT_PATH}/storefronts/${item.id}/licenses/${item.license}`
        : "",
      license_status: item.license_status,
      status: item.status,
      score: item.score,
      number_of_products: item.number_of_products,
      province: item.province,
      city: item.city,
      created_at: this.calculCreatedAt(item.created_at),
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public transformProduct(item: Partial<Storefront> | any) {
    return {
      id: item.id,
      category: item.category,
      sub_category: item.subCategory,
      brand: item.brand,
      tracking_code: item.trackingCode,
      title: item.title,
      description: item.description,
      status: item.status,
      price: item.price.toString(),
      unit_of_sales: item.unitOfSales,
      has_discount: item.hasDiscount,
      discounted_price: item.discountedPrice.toString(),
      colors: item.colors,
      files: this.collectionFile(
        item.files,
        `marketplace/products/${item.id}/`
      ),
    };
  }

  public transformFile(item: any, destination: string) {
    if (!item) {
      return {
        id: -1,
        file_name: "",
        file_type: null,
        file_url: "",
        sort_number: -1,
        priority: null,
      };
    }
    console.log(item.file_name);
    return {
      id: item.id,
      file_name: item.file_name,
      file_type: item.file_type,
      file_url:
        process.env.APP_CONTENT_PATH + `/${destination}/` + item.file_name,
      sort_number: item.sort_number,
      priority: item.priority,
    };
  }

  public collectionFile(items: any[], destination: string) {
    return items.map((item) => this.transformFile(item, destination));
  }

  public collectionProduct(items: any[]) {
    return items.map((item) => this.transformProduct(item));
  }

  public transformComments(item: any) {
    if (!item) {
      return {
        id: -1,
        store_id: -1,
        comment: "",
        score: -1,
        client: {},
        created_at: "",
      };
    }

    return {
      id: item.id,
      store_id: item.store_id,
      comment: item.comment,
      score: item.score,
      client: this.clientInfo(item.client),
      created_at: this.calculCreatedAt(item.created_at),
    };
  }

  public collectionComments(items: any[]) {
    return items.map((item) => this.transformComments(item));
  }

  private clientInfo(client: any) {
    return {
      id: client.id,
      name: client.name + " " + client.surname,
      phone: client.phone,
    };
  }

  private calculCreatedAt(created_at: string) {
    const currentYear = Number(
      jmoment(new Date(Date.now())).locale("fa").format("YYYY")
    );

    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));

    let info = "";
    if (Number(currentYear) === Number(year)) {
      info = month + " " + day.toString();
    } else {
      info = ` ${year} ${month} ${day} `;
    }
    return info;
  }
}

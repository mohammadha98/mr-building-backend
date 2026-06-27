import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
import { Storefront, StorefrontProducts } from "@prisma/client";
import { DateToPersian } from "src/modules/services/DateService";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class StorefrontAppTransformer {
  public transform(item: Partial<Storefront> | any) {
    const top_products: any[] = [];

    if (item.products && item.products.length) {
      item.products.map((item) => {
        if (item.files.length) {
          top_products.push({
            product_id: item.id,
            thumbnail: process.env.APP_CONTENT_PATH + item.files[0].thumbnail,
          });
        }
      });
    }

    return {
      id: item.id,
      tracking_code: item.trackingCode,
      client_id: item.client_id,
      name: item.name,
      description: item.description,
      has_adoptive: true,
      color: item.color,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/storefronts/${item.id}/avatars/${item.avatar}`
        : "",
      avatar_thumbnail: item.avatar_thumbnail
        ? `${process.env.APP_CONTENT_PATH}${item.avatar_thumbnail}`
        : "",
      license: item.license
        ? `${process.env.APP_CONTENT_PATH}/storefronts/${item.id}/licenses/${item.license}`
        : "",
      license_status: item.license_status,
      status: item.status,
      number_of_products: item.number_of_products,
      province: item.province,
      city: item.city,
      category_id: item.categoryId,
      top_products,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public transformTopStore(item: Partial<Storefront> | any) {
    const top_products: any[] = [];

    item.products.map((item) => {
      if (item.files.length) {
        top_products.push({
          product_id: item.id,
          thumbnail: process.env.APP_CONTENT_PATH + item.files[0].thumbnail,
        });
      }
    });

    return {
      id: item.id,
      tracking_code: item.trackingCode,
      has_adoptive: true,
      color: item.color,
      client_id: item.client_id,
      name: item.name,
      description: item.description,
      score: item.score,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/storefronts/${item.id}/avatars/${item.avatar}`
        : "",
      avatar_thumbnail: `${process.env.APP_CONTENT_PATH}${item.avatar_thumbnail}`,
      // license: item.license
      //   ? `${process.env.APP_CONTENT_PATH}/storefronts/${item.id}/licenses/${item.license}`
      //   : "",
      // license_status: item.license_status,
      status: item.status,
      number_of_products: item.number_of_products,
      province: item.province,
      city: item.city,

      top_products,
    };
  }

  public collectionTopStores(items: any[]) {
    return items.map((item) => this.transformTopStore(item));
  }

  public transformProduct(item: Partial<Storefront> | any) {
    return {
      id: item.id,
      storefront: this.transform(item.storefront),
      category: item.category,
      sub_category: item.subCategory,
      brand: item.brand,
      tracking_code: item.trackingCode,
      title: item.title,
      score: item.score,
      description: item.description,
      status: item.status,
      price: item.price.toString(),
      unit_of_sales: item.unitOfSales,
      has_discount: item.hasDiscount,
      discounted_price: item.discountedPrice.toString(),
      colors: item.colors,
      updated_at: DateToPersian(item.updatedAt),
      files: this.collectionFile(item.files),
    };
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

  public transformFile(item: any) {
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
    return {
      id: item.id,
      thumbnail: process.env.APP_CONTENT_PATH + item.thumbnail,
      file_name: process.env.APP_CONTENT_PATH + item.file_name,
      file_type: item.file_type,
      file_url: process.env.APP_CONTENT_PATH + item.file_name,
      sort_number: item.sort_number,
      priority: item.priority,
    };
  }

  public collectionFile(items: any[]) {
    return items.map((item) => this.transformFile(item));
  }

  public transformDetails(item: Partial<StorefrontProducts> | any) {
    return {
      id: item.id,
      storefront: this.transform(item.storefront),
      category: item.category,
      sub_category: item.subCategory,
      brand: item.brand,
      tracking_code: item.trackingCode,
      title: item.title,
      has_adoptive: true,
      color: item.color,
      score: item.score,
      description: item.description,
      status: item.status,
      price: item.price.toString(),
      unit_of_sales: item.unitOfSales,
      has_discount: item.hasDiscount,
      discounted_price: item.discountedPrice.toString(),
      colors: item.colors,
      updated_at: DateToPersian(item.updatedAt),
      items: this.collectionFeatures(item.features),
      files: this.collectionFile(item.files),
    };
  }

  public transformFeatures(item: any) {
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      field_id: item.feature.id,
      field_name: item.feature.field_name,
      value: item.value,
    };
  }

  public collectionFeatures(items: any[]) {
    return items.map((item) => this.transformFeatures(item));
  }

  public collectionTopProductFile(items: any[], destination: string) {
    return items.map((item) => {
      return {
        product_id: item.productId,
        file:
          process.env.APP_CONTENT_PATH + `/${destination}/` + item.file_name,
      };
    });
  }
}

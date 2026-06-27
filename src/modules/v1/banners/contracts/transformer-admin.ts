import { Injectable } from "@nestjs/common";

@Injectable()
export default class BannerTransformerAdmin {
  public transform(banner: any) {
    if (!banner) {
      return null;
    }
    return {
      id: banner.id,
      title: banner.title,
      tag: banner.tag,
      url: banner.url,
      thumbnail: `${process.env.APP_CONTENT_PATH}/banners/${banner.thumbnail}`,
      created_at: banner.createdAt,
    };
  }

  public collection(banners: any[]) {
    return banners.map((banner: any) => this.transform(banner));
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export default class BannerTransformerApp {
  public transform(slider: any) {
    return {
      id: slider.id,
      title: slider.title,
      thumbnail: `${process.env.APP_CONTENT_PATH}/banners/${slider.thumbnail}`,
    };
  }

  public collection(sliders: any[]) {
    return sliders.map((slider: any) => this.transform(slider));
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export default class SliderTransformerApp {
  public transform(slider: any) {
    if (!slider) {
      return null;
    }
    return {
      id: slider.id,
      title: slider.title,
      thumbnail: `${process.env.APP_CONTENT_PATH}/sliders/${slider.thumbnail}`,
    };
  }

  public collection(sliders: any[]) {
    return sliders.map((slider: any) => this.transform(slider));
  }
}

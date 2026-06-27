import { Injectable } from "@nestjs/common";

@Injectable()
export default class SliderTransformerAdmin {
  public transform(slider: any) {
    return {
      id: slider.id,
      title: slider.title,
      tag: slider.tag,
      thumbnail: `${process.env.APP_CONTENT_PATH}/sliders/${slider.thumbnail}`,
      created_at: slider.createdAt,
    };
  }

  public collection(sliders: any[]) {
    return sliders.map((slider: any) => this.transform(slider));
  }
}

export default class SliderTransformerApp {
    transform(slider: any): {
        id: any;
        title: any;
        thumbnail: string;
    };
    collection(sliders: any[]): {
        id: any;
        title: any;
        thumbnail: string;
    }[];
}

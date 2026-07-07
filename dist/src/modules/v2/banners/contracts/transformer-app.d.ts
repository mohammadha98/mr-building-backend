export default class BannerTransformerApp {
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

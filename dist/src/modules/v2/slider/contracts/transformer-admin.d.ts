export default class SliderTransformerAdmin {
    transform(slider: any): {
        id: any;
        title: any;
        tag: any;
        thumbnail: string;
        created_at: any;
    };
    collection(sliders: any[]): {
        id: any;
        title: any;
        tag: any;
        thumbnail: string;
        created_at: any;
    }[];
}

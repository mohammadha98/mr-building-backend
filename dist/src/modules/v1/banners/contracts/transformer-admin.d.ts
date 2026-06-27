export default class BannerTransformerAdmin {
    transform(banner: any): {
        id: any;
        title: any;
        tag: any;
        url: any;
        thumbnail: string;
        created_at: any;
    };
    collection(banners: any[]): {
        id: any;
        title: any;
        tag: any;
        url: any;
        thumbnail: string;
        created_at: any;
    }[];
}

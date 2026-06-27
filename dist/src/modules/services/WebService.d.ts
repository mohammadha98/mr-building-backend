export default class WebService {
    constructor();
    get(endpoint: string, config?: any): Promise<import("axios").AxiosResponse<any, any>>;
    post(endpoint: string, data?: any, config?: any): Promise<import("axios").AxiosResponse<any, any>>;
    patch(endpoint: string, dataObj?: any, config?: any): Promise<import("axios").AxiosResponse<any, any>>;
    delete(endpoint: string, config?: any): Promise<import("axios").AxiosResponse<any, any>>;
}

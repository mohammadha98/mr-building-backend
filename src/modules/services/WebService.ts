import axios from "axios";

export default class WebService {
  constructor() {}

  public async get(endpoint: string, config: any = {}) {
    const data = await axios.get(`${endpoint}`, config);
    return data;
  }

  public async post(endpoint: string, data?: any, config?: any) {
    return await axios.post(`${endpoint}`, data, config);
  }

  public async patch(endpoint: string, dataObj?: any, config?: any) {
    const data = await axios.patch(`${endpoint}`, dataObj, config);
    return data;
  }

  public async delete(endpoint: string, config?: any) {
    const data = await axios.delete(`${endpoint}`, config);
    return data;
  }
}

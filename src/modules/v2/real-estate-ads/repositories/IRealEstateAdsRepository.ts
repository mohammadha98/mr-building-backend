import IRepository from "src/commons/contracts/IRepository";

export default interface IRealEstateAdsRepository extends IRepository<any> {
  findByStatus(status: string): Promise<any[] | []>;
  getFileInfo(query: any): Promise<any>;
  deleteTempFile(id: number): Promise<any>;
  removeItems(id: number): Promise<any>;
  createItem(params: any): Promise<any>;
  createMedia(params: any): Promise<any>;
  findMedia(params: any): Promise<any>;
  changeStatus(where: any, data: any): Promise<any>;
}

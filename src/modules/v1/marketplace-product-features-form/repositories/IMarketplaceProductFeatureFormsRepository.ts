import IRepository from "src/commons/contracts/IRepository";

export default interface IMarketplaceProductFeatureFormsRepository
  extends IRepository<any> {
  saveItem(params: any);
  findManyItems(params: any);
  findOneItem(params: any);
  deleteOneItem(params: any);
  deleteManyItem(params: any);
  updateOneItem(where: any, updateData: any);
}

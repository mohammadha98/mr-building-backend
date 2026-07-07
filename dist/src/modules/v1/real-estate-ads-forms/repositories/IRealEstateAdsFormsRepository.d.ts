import IRepository from "src/commons/contracts/IRepository";
export default interface IRealEstateAdsFormsRepository extends IRepository<any> {
    saveItem(params: any): any;
    findManyItems(params: any): any;
    findOneItem(params: any): any;
    deleteOneItem(params: any): any;
    deleteManyItem(params: any): any;
    updateOneItem(where: any, updateData: any): any;
}

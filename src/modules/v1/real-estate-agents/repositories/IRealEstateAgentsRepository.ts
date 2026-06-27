import IPagination from "src/commons/contracts/IPagination";
import IRepository from "src/commons/contracts/IRepository";

export default interface IRealEstateAgentsRepository extends IRepository<any> {
  findByStatus(status: string): Promise<any[] | []>;
  findNewItems(
    params: any,
    include: any,
    pagination?: IPagination
  ): Promise<any[] | []>;
}

import IRepository from "src/commons/contracts/IRepository";
export default interface IRealEstateAgentsCommentsRepository extends IRepository<any> {
    findByStatus(status: string): Promise<any[] | []>;
}

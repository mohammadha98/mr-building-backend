import IRepository from "src/commons/contracts/IRepository";

export interface IUserRepository extends IRepository<any> {
  login(email: string): Promise<any | null>;
  updateToken(params: any, data: any): Promise<any | null>;
}

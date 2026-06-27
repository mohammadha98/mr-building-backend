import IPagination from "src/commons/contracts/IPagination";
import { IUserRepository } from "./IUserRepository";
import { PrismaService } from "../../../../../../prisma/prisma.service";
export default class UserPrismaRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    count(params: any): Promise<number>;
    findOneByID(id: any): Promise<any>;
    updateToken(user_id: number, token: string): Promise<any>;
    login(email: string): Promise<any | null>;
    create(params: any): Promise<any>;
    saveUserRoles(userID: number, roles: string[]): Promise<any>;
    findOne(params: any): Promise<any | null>;
    findMany(params: any, relations?: string[], pagination?: IPagination): Promise<any[]>;
    updateOne(where: Partial<any>, updateData: Partial<any>): Promise<any>;
    updateMany(where: Partial<any>, updateData: Partial<any>): Promise<any>;
    deleteOne(where: any): Promise<any>;
    deleteUserRoles(userID: number): Promise<any>;
    deleteMany(where: any): Promise<any>;
}

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import UserPrismaRepository from "./repositories/UserPrismaRepository";
import { JwtService } from "@nestjs/jwt";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { UserChangePasswordDto } from "./dto/user-change-password.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto copy";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UpdateUserRolesDto } from "./dto/update-user-roles.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
export declare class UsersService {
    private readonly userPrismaModel;
    private jwtService;
    private readonly prismaService;
    private readonly mailerService;
    constructor(userPrismaModel: UserPrismaRepository, jwtService: JwtService, prismaService: PrismaService, mailerService: MailerService);
    create(createUserDto: CreateUserDto): Promise<{
        status: number;
        user: any;
    } | {
        status: number;
        user?: undefined;
    }>;
    private generateUniqKey;
    findAll(query: PaginationDto): Promise<{
        status: number;
        users?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        users: {
            id: number;
            name: string;
            email: string;
            uniqKey: string;
            phone: string;
            avatar: string;
            token: string;
            refresh_token: string;
            status: string;
            created_at: Date;
            roles: {
                role: {
                    id: string;
                    title: string;
                    key: string;
                    description: string;
                    permissions: {
                        category: {
                            category: {
                                id: string;
                                title: string;
                                key: string;
                            };
                        };
                        permission: {
                            id: string;
                            title: string;
                            key: string;
                            category: {
                                id: string;
                            };
                        };
                    }[];
                };
            }[];
        }[];
        metadata: IMetadata;
    }>;
    login(email: string, password: string): Promise<{
        status: number;
        user?: undefined;
    } | {
        status: number;
        user: any;
    }>;
    getUserInfo(userInfoDto: any): Promise<{
        status: number;
        user?: undefined;
    } | {
        status: number;
        user: any;
    }>;
    tokenValidaion(id: number): Promise<{
        status: number;
        user?: undefined;
    } | {
        status: number;
        user: any;
    }>;
    updateUser(updateUserDto: UpdateUserDto): Promise<{
        status: number;
    }>;
    updateRoles(body: UpdateUserRolesDto): Promise<{
        status: number;
    }>;
    private updateUserRoles;
    updateUserProfile(updateUserDto: UpdateUserProfileDto): Promise<{
        status: number;
    }>;
    removeUser(user_id: number): Promise<{
        status: number;
    }>;
    changePassword(changePasswordDto: UserChangePasswordDto): Promise<{
        status: number;
    }>;
    validateWithID(user_id: number): Promise<any>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}

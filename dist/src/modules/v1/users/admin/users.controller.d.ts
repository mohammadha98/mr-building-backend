import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import UserTransformer from "./Transformer";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UserChangePasswordDto } from "./dto/user-change-password.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto copy";
import { UpdateUserRolesDto } from "./dto/update-user-roles.dto";
export declare class UsersController {
    private readonly usersService;
    private readonly userTransformer;
    private readonly responseHandler;
    constructor(usersService: UsersService, userTransformer: UserTransformer);
    create(body: CreateUserDto, request: any, res: Response): Promise<any>;
    userInfo(user_key: string, req: any, res: Response): Promise<any>;
    login(registerAuthDto: LoginUserDto, req: any, res: Response): Promise<any>;
    tokenValidaion(req: any, res: Response): Promise<any>;
    findAll(paginationQuery: PaginationDto, req: any, res: Response): Promise<any>;
    update(updateUserDto: UpdateUserDto, req: any, res: Response): Promise<any>;
    updateUserRoles(updateUserDto: UpdateUserRolesDto, req: any, res: Response): Promise<any>;
    removeUser(user_id: number, req: any, res: Response): Promise<any>;
    changePassword(changePasswordDto: UserChangePasswordDto, req: any, res: Response): Promise<any>;
    updateProfile(updateUserDto: UpdateUserProfileDto, req: any, res: Response): Promise<any>;
}

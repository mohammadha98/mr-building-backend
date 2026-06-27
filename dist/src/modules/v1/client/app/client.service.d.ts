import { PrismaService } from "../../../../../prisma/prisma.service";
import { UpdateClientDto } from "./dto/update-client.dto";
import { DisableUpdateStatus } from "./dto/disbale-update-status";
import { SaveGifClientDto } from "./dto/save-gif-client.dto";
import { VerifyAuthDto } from "src/modules/v1//auth/dto/verify-auth.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { UpdateClienProfiletDto } from "./dto/update-profile.dto";
import { Client, DailyMissionsLogs, Missions } from "@prisma/client";
export declare class ClientService {
    private prisma;
    private eventService;
    private uploadService;
    constructor(prisma: PrismaService);
    create(verifyAuthDto: VerifyAuthDto): Promise<false | {
        id: number;
        webinar_provider_id: number;
        name: string;
        surname: string;
        phone: string;
        username: string;
        email: string;
        has_update_direct: boolean;
        avatar: string;
        score: number;
        token: string;
        key: string;
        province: {
            id: number;
            name: string;
        };
        city: {
            id: number;
            name: string;
        };
    }>;
    private saveReceivedMission;
    saveMission(mission: Missions, client: Client): Promise<boolean>;
    saveMissionDailyLogin(dailyMissionInfo: Missions, dailyMissionsLogs: DailyMissionsLogs, client: Client): Promise<void>;
    private handleDailyLogin;
    calculateTimeDifference(number_of_hours: number, usedAt: Date): boolean;
    saveHistoryOfScore(client_id: number, mission: Missions, latestScore: number, action: string): Promise<boolean>;
    findOne(phone: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        webinar_provider_id: number;
        name: string;
        score: number;
        surname: string;
        phone: string;
        key: string;
        email: string;
        username: string;
        password: string;
        type: string;
        roles: string[];
        avatar: string;
        token: string;
        validate_email: boolean;
        status: string;
        has_update_direct: boolean;
        has_update_cafebazar: boolean;
        has_update_myket: boolean;
        has_update_google_play: boolean;
        has_update_general_notification: boolean;
        created_at: Date;
        updated_at: Date;
        last_login_time: Date;
        installed_version: string;
        provincesId: number;
        citiesId: number;
        masterProjectCommentLikesId: string;
    }, unknown, never> & {}>;
    clientInfo(id: number): Promise<{
        status: number;
        client_info?: undefined;
    } | {
        status: number;
        client_info: any;
    }>;
    update(updateClientDto: UpdateClientDto): Promise<{
        status: number;
        client: {
            id: number;
            name: string;
            surname: string;
            username: string;
            email: string;
            has_update_direct: boolean;
            avatar: string;
            token: string;
            webinar_provider_id: number;
            phone: string;
            key: string;
            province: {
                id: number;
                name: string;
            };
            city: {
                id: number;
                name: string;
            };
        };
    } | {
        status: number;
        client?: undefined;
    }>;
    updateClienProfile(body: UpdateClienProfiletDto): Promise<{
        status: number;
        client?: undefined;
    } | {
        client: any;
        status?: undefined;
    }>;
    saveGif(body: SaveGifClientDto): Promise<{
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: number;
            file: string;
            key: string;
            client_id: number;
            created_at: Date;
        }, unknown, never> & {};
    } | {
        status: number;
        result?: undefined;
    }>;
    getClientGifList(query: PaginationDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: (import("@prisma/client/runtime").GetResult<{
            id: number;
            file: string;
            key: string;
            client_id: number;
            created_at: Date;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    activateUpdates(installed_version_type: string): Promise<boolean>;
    disableUpdateStatus(query: DisableUpdateStatus): Promise<boolean>;
    addRole(client_id: number, role: string): Promise<void>;
    removeRole(client_id: number, role: string): Promise<void>;
    updateToken(id: number, token: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        webinar_provider_id: number;
        name: string;
        score: number;
        surname: string;
        phone: string;
        key: string;
        email: string;
        username: string;
        password: string;
        type: string;
        roles: string[];
        avatar: string;
        token: string;
        validate_email: boolean;
        status: string;
        has_update_direct: boolean;
        has_update_cafebazar: boolean;
        has_update_myket: boolean;
        has_update_google_play: boolean;
        has_update_general_notification: boolean;
        created_at: Date;
        updated_at: Date;
        last_login_time: Date;
        installed_version: string;
        provincesId: number;
        citiesId: number;
        masterProjectCommentLikesId: string;
    }, unknown, never> & {}>;
    private generateCode;
    validateWithID(client_id: number): Promise<false | (import("@prisma/client/runtime").GetResult<{
        id: number;
        webinar_provider_id: number;
        name: string;
        score: number;
        surname: string;
        phone: string;
        key: string;
        email: string;
        username: string;
        password: string;
        type: string;
        roles: string[];
        avatar: string;
        token: string;
        validate_email: boolean;
        status: string;
        has_update_direct: boolean;
        has_update_cafebazar: boolean;
        has_update_myket: boolean;
        has_update_google_play: boolean;
        has_update_general_notification: boolean;
        created_at: Date;
        updated_at: Date;
        last_login_time: Date;
        installed_version: string;
        provincesId: number;
        citiesId: number;
        masterProjectCommentLikesId: string;
    }, unknown, never> & {})>;
    deCreaseScore(client_id: number, point: number): Promise<number | false>;
    inCreaseScore(client_id: number, point: number): Promise<number | false>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}

import { CreateEventGroupDto } from "./dto/Create-event-group.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { DeleteEventGroupDto } from "./dto/delete-event-groupdto.ts";
import { EventGroupPaginationDto } from "./dto/Event-group-pagination.dto";
import { PrismaService } from "../../../../../../prisma/prisma.service";
export declare class eventGroupsService {
    private prisma;
    private readonly eventService;
    private readonly smsService;
    constructor(prisma: PrismaService);
    findAllMyOwnWebinars(user_id: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        webinar_id: number;
        owner_id: number;
        title: string;
        event_link: string;
        tag: string;
        status: string;
        created_at: Date;
    }, unknown, never> & {})[]>;
    findAllGroups(query: EventGroupPaginationDto): Promise<{
        status: number;
        groups?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        groups: (import("@prisma/client/runtime").GetResult<{
            id: number;
            webinar_id: number;
            owner_id: number;
            title: string;
            event_link: string;
            tag: string;
            status: string;
            created_at: Date;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    findInvitedWebinars(room_id: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        client_id: number;
        userid: number;
        display_name: string;
        phone: string;
        role: string;
        event_room_id: number;
    }, unknown, never> & {})[]>;
    deleteWebinar(data: DeleteEventGroupDto): Promise<{
        status: number;
    }>;
    webinarStatusInactived(data: DeleteEventGroupDto): Promise<{
        status: number;
    }>;
    store(CreateEventGroupDto: CreateEventGroupDto): Promise<{
        status: number;
        event: import("@prisma/client/runtime").GetResult<{
            id: number;
            webinar_id: number;
            owner_id: number;
            title: string;
            event_link: string;
            tag: string;
            status: string;
            created_at: Date;
        }, unknown, never> & {};
        client: import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {};
    } | {
        status: number;
        event?: undefined;
        client?: undefined;
    }>;
    createNewWebinarInProvider(CreateWebinarDto: any): Promise<any>;
    addUserToEvent_teacherRole(event_id: number, users: any): Promise<any>;
    private generateSlug;
    sendLoginInfoWithSMS(client: any): void;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
